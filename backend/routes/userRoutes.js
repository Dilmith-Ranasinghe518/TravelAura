const express = require("express");
const { updateUserProfile, deleteUserAccount } = require("../controllers/userController");
const router = express.Router();

// Update profile
router.put("/update-profile/:userId", updateUserProfile);

// Delete account
router.delete("/delete-account/:userId", deleteUserAccount);

module.exports = router;
