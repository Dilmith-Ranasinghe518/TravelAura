const Accommodation = require("../models/accommadationmodel");

// Get all accommodations
const getAllAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find();
    if (!accommodations) {
      return res.status(404).json({ message: "Accommodations not found" });
    }
    return res.status(200).json({ accommodations });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Add a new accommodation
const addAccommodation = async (req, res) => {
  try {
    const acc = await Accommodation.create(req.body);
    return res.status(201).json({ accommodation: acc });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ message: "Validation or insert error", error: err.message });
  }
};

// Get accommodation by ID
const getByAccommodationID = async (req, res) => {
  try {
    const acc = await Accommodation.findById(req.params.id);
    if (!acc) {
      return res.status(404).json({ message: "Accommodation not available" });
    }
    return res.status(200).json({ accommodation: acc });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Invalid ID", error: err.message });
  }
};

// Update an accommodation
const updateAccommodation = async (req, res) => {
  try {
    const acc = await Accommodation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!acc) {
      return res
        .status(404)
        .json({ message: "Unable to update accommodation" });
    }
    return res.status(200).json({ accommodation: acc });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Update error", error: err.message });
  }
};

// Delete an accommodation
const deleteAccommodation = async (req, res) => {
  try {
    const acc = await Accommodation.findByIdAndDelete(req.params.id);
    if (!acc) {
      return res
        .status(404)
        .json({ message: "Unable to delete accommodation" });
    }
    return res.status(200).json({ accommodation: acc });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Delete error", error: err.message });
  }
};

module.exports = {
  getAllAccommodations,
  addAccommodation,
  getByAccommodationID,
  updateAccommodation,
  deleteAccommodation,
};
