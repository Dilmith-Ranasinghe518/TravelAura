const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Update User Profile (username, email, password, phone, address)
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, currentPassword, newPassword, phone, address } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Update name
    if (name) user.name = name;

    // Update email
    if (email) user.email = email;

    // Update password
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ msg: "Current password required" });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Current password incorrect" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Update phone and address
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();
    res.json({ msg: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete User Account
const deleteUserAccount = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { updateUserProfile, deleteUserAccount };
