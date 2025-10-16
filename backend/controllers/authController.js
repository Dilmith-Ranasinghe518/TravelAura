// controllers/authController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// USER REGISTER (Without OTP)
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({ name, email, password: hashedPassword, role: "user" });
    await newUser.save();

    res.json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ADMIN REGISTER
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, securityCode } = req.body;

    // Validate security code
    if (securityCode !== "1234") {
      return res.status(400).json({ msg: "Invalid security code" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Admin already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new User({ name, email, password: hashedPassword, role: "admin" });
    await newAdmin.save();

    res.json({ msg: "Admin registered successfully" });
  } catch (err) {
    console.error("Admin Registration error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// LOGIN (for both users and admins)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Send response with user details (excluding password)
    res.json({
      msg: "Login success",
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { registerUser, registerAdmin, loginUser };
