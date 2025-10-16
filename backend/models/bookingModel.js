// backend/models/bookingmodel.js
const mongoose = require("mongoose");
const schema = mongoose.Schema;

// bookingmodel.js
const bookingSchema = new schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true }, // ✅ match frontend
    phone: { type: String, required: true }, // ✅ match frontend
    accommodation: { type: mongoose.Schema.Types.ObjectId, ref: "Accommodation" },
    qty: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "Confirmed" },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Booking", bookingSchema);
