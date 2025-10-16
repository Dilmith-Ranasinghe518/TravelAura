// backend/routes/bookingroutes.js
const express = require("express");
const router = express.Router();

const bookingControl = require("../controllers/bookingcontroller");

router.post("/", bookingControl.createBooking);
router.get("/", bookingControl.getAllBookings);

module.exports = router;
