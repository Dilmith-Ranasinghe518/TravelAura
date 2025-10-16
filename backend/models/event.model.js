const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema(
  {
    // identity
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },

    // content
    description: { type: String },

    // time
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },

    // classification
    type: {
      type: String,
      enum: ["event", "festival"],
      default: "event",
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },

    category: {
      type: String,
      enum: [
        "Religious",
        "Music",
        "Food",
        "Sports",
        "Community",
        "Cultural",
        "Nature",
        "Other",
      ],
    },
    tags: { type: [String], default: [] },

    // media
    image_links: { type: [String], default: [] },

    // location
    location: { type: String },

    // trending
    is_trending: { type: Boolean, default: false, index: true },

    // engagement counters
    views_count: { type: Number, default: 0 },
    likes_count: { type: Number, default: 0 },
    trending_score: { type: Number, default: 0 },
    trending_computed_at: { type: Date },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// indexes
EventSchema.index({ status: 1, start_date: 1 });
EventSchema.index({ type: 1, start_date: 1 });

// validation
EventSchema.path("end_date").validate(function (v) {
  if (!this.start_date || !v) return true;
  return v >= this.start_date;
}, "end_date must be on or after start_date");

module.exports = mongoose.model("Event", EventSchema);
