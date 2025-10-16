// routes/authRoutes.js
const express = require("express");
const { registerUser, registerAdmin, loginUser } = require("../controllers/authController");

const router = express.Router();

// User Registration Route
router.post("/register", registerUser);

// Admin Registration Route
router.post("/register-admin", registerAdmin);

// Login Route
router.post("/login", loginUser);

module.exports = router;
