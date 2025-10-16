const mongoose = require("mongoose");
const Event = require("../models/event.model"); // <-- path to the Event model you created

// ---- helpers ----
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const ALLOWED_STATUSES = ["draft", "published", "archived"];
const STATUS_TRANSITIONS = {
  draft: ["published", "archived"],
  published: ["archived"],
  archived: [], // no transitions from archived
};

const canTransition = (from, to) =>
  ALLOWED_STATUSES.includes(from) &&
  ALLOWED_STATUSES.includes(to) &&
  STATUS_TRANSITIONS[from]?.includes(to);

// prefer slug if provided, else id
const findByIdentifier = async (identifier) => {
  if (!identifier) return null;
  if (isValidObjectId(identifier)) {
    return await Event.findById(identifier);
  }
  return await Event.findOne({ slug: identifier });
};

// ---- controllers ----

// GET /events?admin=true|false
exports.getEvents = async (req, res) => {
  const { admin } = req.query;

  try {
    let query = {};
    if (admin === "true") {
      // return all (any status)
      query = {};
    } else {
      // only published and not ended yet (optional)
      query = { status: "published" };
    }

    const events = await Event.find(query).sort({ start_date: 1 });
    return res.status(200).json({ success: true, data: events });
  } catch (err) {
    console.error("getEvents error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET /events/:identifier  (identifier = ObjectId or slug)
exports.getEvent = async (req, res) => {
  const { identifier } = req.params;
  try {
    const event = await findByIdentifier(identifier);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    return res.status(200).json({ success: true, data: event });
  } catch (err) {
    console.error("getEvent error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET /events/:identifier/related
exports.getRelatedEvents = async (req, res) => {
  const { identifier } = req.params;
  try {
    const mainEvent = await findByIdentifier(identifier);
    if (!mainEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const related = await Event.find({
      _id: { $ne: mainEvent._id },
      status: "published",
      category: mainEvent.category || { $exists: false },
    })
      .sort({ start_date: 1 })
      .limit(10);

    return res.status(200).json({ success: true, data: related });
  } catch (err) {
    console.error("getRelatedEvents error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// POST /events
exports.createEvent = async (req, res) => {
  try {
    const payload = req.body || {};
    const { title, start_date, end_date } = payload;

    if (!title || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, start_date and end_date",
      });
    }

    // If slug missing, generate a simple one
    if (!payload.slug && payload.title) {
      payload.slug = payload.title
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const created = await Event.create(payload);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    // handle duplicate slug
    if (err?.code === 11000 && err?.keyPattern?.slug) {
      return res.status(409).json({
        success: false,
        message: "Slug already exists. Please use a different slug.",
      });
    }
    console.error("createEvent error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// PUT /events/:id
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const payload = req.body || {};

  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid Event Id" });
  }

  try {
    const updated = await Event.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.slug) {
      return res.status(409).json({
        success: false,
        message: "Slug already exists. Please use a different slug.",
      });
    }
    console.error("updateEvent error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// PATCH /events/:id/status
exports.updateEventStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};

  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid Event Id" });
  }
  if (!ALLOWED_STATUSES.includes(status)) {
    return res
      .status(400)
      .json({ success: false, message: "Status must be draft, published, or archived" });
  }

  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    if (!canTransition(event.status, status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change from ${event.status} to ${status}`,
      });
    }

    event.status = status;
    await event.save();

    return res.status(200).json({ success: true, data: event });
  } catch (err) {
    console.error("updateEventStatus error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// PATCH /events/:id/trending (body: { is_trending: boolean })
exports.updateEventTrending = async (req, res) => {
  const { id } = req.params;
  const { is_trending } = req.body || {};

  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid Event Id" });
  }
  if (typeof is_trending !== "boolean") {
    return res
      .status(400)
      .json({ success: false, message: "is_trending must be true or false" });
  }

  try {
    const updated = await Event.findByIdAndUpdate(
      id,
      { is_trending },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("updateEventTrending error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE /events/:id
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid Event Id" });
  }

  try {
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    return res.status(200).json({ success: true, message: "Event deleted" });
  } catch (err) {
    console.error("deleteEvent error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// POST /events/:id/view
exports.incrementEventView = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid Event Id" });
  }

  try {
    const updated = await Event.findByIdAndUpdate(
      id,
      {
        $inc: { views_count: 1, trending_score: 1 }, // simple score
        trending_computed_at: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        views_count: updated.views_count,
        trending_score: updated.trending_score,
      },
    });
  } catch (err) {
    console.error("incrementEventView error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// POST /events/:id/like
exports.likeEvent = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid Event Id" });
  }

  try {
    const updated = await Event.findByIdAndUpdate(
      id,
      {
        $inc: { likes_count: 1, trending_score: 2 }, // likes weigh higher
        trending_computed_at: new Date(),
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        likes_count: updated.likes_count,
        trending_score: updated.trending_score,
      },
    });
  } catch (err) {
    console.error("likeEvent error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// POST /events/:id/unlike
exports.unlikeEvent = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid Event Id" });
  }

  try {
    const updated = await Event.findByIdAndUpdate(
      id,
      {
        $inc: { likes_count: -1, trending_score: -2 },
        trending_computed_at: new Date(),
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        likes_count: updated.likes_count,
        trending_score: updated.trending_score,
      },
    });
  } catch (err) {
    console.error("unlikeEvent error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// PATCH /events/trending/recompute  (body/query: topN=10)
exports.recomputeAllTrending = async (req, res) => {
  const topN = Number(req.body?.topN || req.query?.topN || 10);

  try {
    // naive recompute: set is_trending=true for topN by trending_score (published only)
    const published = await Event.find({ status: "published" }).sort({
      trending_score: -1,
    });

    const top = published.slice(0, topN).map((e) => e._id);

    // set all to false first
    await Event.updateMany({}, { $set: { is_trending: false } });
    // set only top to true
    if (top.length > 0) {
      await Event.updateMany(
        { _id: { $in: top } },
        { $set: { is_trending: true, trending_computed_at: new Date() } }
      );
    }

    return res.status(200).json({ success: true, data: { top_trending_ids: top } });
  } catch (err) {
    console.error("recomputeAllTrending error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
