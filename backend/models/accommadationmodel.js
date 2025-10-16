const mongoose = require("mongoose");
const schema = mongoose.Schema;

const accommodationSchema = new schema({
  accommodationId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  accommodationName: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String, // e.g., Hotel, Resort, Villa, Apartment, Hostel
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String, // city/region (keep simple for now)
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  roomType: {
    type: [String], // allow multiple types if needed
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    trim: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  amenities: {
    type: [String],
    required: true,
  },
  checkInTime: {
    type: String, // e.g., "14:00"
    required: true,
    trim: true,
  },
  checkOutTime: {
    type: String, // e.g., "11:00"
    required: true,
    trim: true,
  },
  images: {
    type: [String], // image URLs
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Accommodation", accommodationSchema);
