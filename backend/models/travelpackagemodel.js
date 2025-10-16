const mongoose = require("mongoose");
const schema = mongoose.Schema;

const travelPackageSchema = new schema({
  packageId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  packageName: {
    type: String,
    required: true,
    trim: true,
  },
  packageDescription: {
    type: String,
    required: true,
    trim: true,
  },
  packageType: {
    type: String,
    required: true,
    trim: true,
  },
  destinations: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  duration: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  itinerary: {
    type: [String], // Array of steps/activities
    required: true,
  },
  inclusions: {
    type: [String], // Array of included features/services
    required: true,
  },
  exclusions: {
    type: [String], // Array of excluded features/services
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  currency: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  transportType: {
    type: String,
    required: true,
  },
  travelImages: {
    type: [String], // Array of image URLs
    required: true,
  },
});

module.exports = mongoose.model("TravelPackage", travelPackageSchema);
