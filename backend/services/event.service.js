const mongoose = require("mongoose");
const Event = require("../models/eventModel"); // <-- make sure this is CommonJS too

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const WEIGHTS = {
  likes: 10.0,
  views: 0.1,
  recencyWindowDays: 30,
  recencyBoostPerDay: 1.0,
};

class EventService {
  static async getAllEvents() {
    return await Event.find({}).sort({ created_at: -1 });
  }

  static async getPublishedEvents() {
    return await Event.find({ status: "published" }).sort({ start_date: 1 });
  }

  static async getTrendingEvents(limit = 10) {
    return await Event.find({
      status: "published",
      is_trending: true,
    })
      .sort({ trending_score: -1, start_date: 1 })
      .limit(limit);
  }

  static async getEventByIdentifier(identifier) {
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      return await Event.findById(identifier);
    }
    return await Event.findOne({ slug: identifier });
  }

  static async getRelatedEventsByCategory(mainEvent) {
    return await Event.find({
      _id: { $ne: mainEvent._id },
      category: mainEvent.category,
      status: "published",
    }).limit(5);
  }

  static async createEvent(eventData) {
    if (!this.validateDates(eventData.start_date, eventData.end_date)) {
      throw new Error("Invalid start_date or end_date provided");
    }

    let slug = generateSlug(eventData.title);
    const existing = await Event.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const newEvent = new Event({
      ...eventData,
      slug,
      start_date: new Date(eventData.start_date),
      end_date: new Date(eventData.end_date),
      status: eventData.status || "draft",
      is_trending: eventData.is_trending || false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return await newEvent.save();
  }

  static async updateEvent(id, updateData) {
    if (updateData.start_date || updateData.end_date) {
      const current = await Event.findById(id);
      if (!current) return null;

      const start = updateData.start_date || current.start_date;
      const end = updateData.end_date || current.end_date;

      if (!this.validateDates(start, end)) {
        throw new Error("Invalid start_date or end_date provided");
      }
    }

    if (updateData.title) {
      let newSlug = generateSlug(updateData.title);
      const exists = await Event.findOne({ slug: newSlug, _id: { $ne: id } });
      if (exists) newSlug = `${newSlug}-${Date.now()}`;
      updateData.slug = newSlug;
    }

    if (updateData.start_date) updateData.start_date = new Date(updateData.start_date);
    if (updateData.end_date) updateData.end_date = new Date(updateData.end_date);

    updateData.updated_at = new Date();

    return await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  static async updateEventStatus(id, newStatus) {
    const current = await Event.findById(id);
    if (!current) return null;

    const transitions = {
      draft: ["published"],
      published: ["archived"],
      archived: ["draft"],
    };

    if (!transitions[current.status].includes(newStatus)) {
      throw new Error(
        `Cannot change from ${current.status} to ${newStatus}. Allowed: ${transitions[current.status].join(", ")}`
      );
    }

    return await Event.findByIdAndUpdate(
      id,
      { status: newStatus, updated_at: new Date() },
      { new: true }
    );
  }

  static async updateEventTrending(id, isTrending) {
    return await Event.findByIdAndUpdate(
      id,
      { is_trending: isTrending, updated_at: new Date() },
      { new: true }
    );
  }

  static async deleteEvent(id) {
    return await Event.findByIdAndDelete(id);
  }

  // -------- Engagement --------
  static async incrementView(id, inc = 1) {
    if (!this.validateObjectId(id)) return null;
    const updated = await Event.findByIdAndUpdate(
      id,
      { $inc: { views_count: inc } },
      { new: true }
    );
    if (!updated) return null;
    await this.updateTrendingForEvent(id);
    return updated;
  }

  static async changeLikeCount(id, inc = 1) {
    if (!this.validateObjectId(id)) return null;
    const updated = await Event.findByIdAndUpdate(
      id,
      { $inc: { likes_count: inc } },
      { new: true }
    );
    if (!updated) return null;
    if (updated.likes_count < 0) {
      updated.likes_count = 0;
      await Event.findByIdAndUpdate(id, { $set: { likes_count: 0 } });
    }
    await this.updateTrendingForEvent(id);
    return updated;
  }

  static async incrementLike(id) {
    return this.changeLikeCount(id, 1);
  }
  static async decrementLike(id) {
    return this.changeLikeCount(id, -1);
  }

  // -------- Trending --------
  static computeTrendingScoreForEvent(event) {
    if (!event) return 0;
    const now = new Date();
    const start = event.start_date ? new Date(event.start_date) : null;
    const likes = Number(event.likes_count || 0);
    const views = Number(event.views_count || 0);

    let recencyBoost = 0;
    if (start) {
      const daysUntilStart = Math.ceil((start.getTime() - now.getTime()) / MS_PER_DAY);
      if (daysUntilStart <= 0) {
        recencyBoost = WEIGHTS.recencyWindowDays * WEIGHTS.recencyBoostPerDay;
      } else if (daysUntilStart <= WEIGHTS.recencyWindowDays) {
        recencyBoost = (WEIGHTS.recencyWindowDays - daysUntilStart) * WEIGHTS.recencyBoostPerDay;
      }
    }

    return Math.round((likes * WEIGHTS.likes + views * WEIGHTS.views + recencyBoost) * 100) / 100;
  }

  static async updateTrendingForEvent(id) {
    if (!this.validateObjectId(id)) return null;
    const event = await Event.findById(id);
    if (!event) return null;
    event.trending_score = this.computeTrendingScoreForEvent(event);
    event.trending_computed_at = new Date();
    await event.save();
    return event;
  }

  static async updateTrendingForAll(topN = 10) {
    const now = new Date();
    const windowDays = Math.max(WEIGHTS.recencyWindowDays, 90);
    const windowDate = new Date(now.getTime() + windowDays * MS_PER_DAY);

    const candidates = await Event.find({
      status: "published",
      start_date: { $lte: windowDate },
    }).lean();

    if (!candidates || candidates.length === 0) return [];

    const scored = candidates.map((e) => ({
      _id: e._id,
      score: this.computeTrendingScoreForEvent(e),
    }));

    scored.sort((a, b) => b.score - a.score);
    const topIds = scored.slice(0, topN).map((s) => s._id);

    await Event.updateMany({}, { $set: { is_trending: false } });
    if (topIds.length > 0) {
      await Event.updateMany(
        { _id: { $in: topIds } },
        { $set: { is_trending: true, trending_computed_at: new Date() } }
      );
    }

    const bulkOps = scored.map((s) => ({
      updateOne: {
        filter: { _id: s._id },
        update: {
          $set: {
            trending_score: s.score,
            trending_computed_at: new Date(),
          },
        },
      },
    }));

    if (bulkOps.length > 0) await Event.bulkWrite(bulkOps);

    return topIds;
  }

  // -------- Validators --------
  static validateObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  static validateRequiredFields(data) {
    return data.title && data.start_date && data.end_date;
  }

  static validateStatus(status) {
    return ["draft", "published", "archived"].includes(status);
  }

  static validateDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
    return start < end;
  }
}

module.exports = EventService;
