// backend/controllers/bookingcontroller.js
const Booking = require("../models/bookingModel");

// Create new booking
const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    return res.status(201).json({ booking });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Booking failed", error: err.message });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    return res.status(200).json({ bookings });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createBooking, getAllBookings };
