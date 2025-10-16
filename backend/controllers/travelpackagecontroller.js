const TravelPackage = require("../models/travelpackagemodel"); // ✅ use capitalized model name

// Get all travel packages
const getAllTravelPackages = async (req, res, next) => {
  let packages;

  try {
    packages = await TravelPackage.find();
  } catch (err) {
    console.log(err);
  }

  if (!packages) {
    return res.status(404).json({ message: "Travel packages not found" });
  }

  return res.status(200).json({ packages });
};


// Add a new travel package
const addTravelPackage = async (req, res, next) => {
  const {
    packageId,
    packageName,
    packageDescription,
    packageType,
    destinations,
    duration,
    startDate,
    endDate,
    itinerary,
    inclusions,
    exclusions,
    availability,
    currency,
    price,
    transportType,
    travelImages,
  } = req.body;

  let newPackage;

  try {
    newPackage = new TravelPackage({
      packageId,
      packageName,
      packageDescription,
      packageType,
      destinations,
      duration,
      startDate,
      endDate,
      itinerary,
      inclusions,
      exclusions,
      availability,
      currency,
      price,
      transportType,
      travelImages,
    });
    await newPackage.save();
  } catch (err) {
    console.log(err);
  }

  if (!newPackage) {
    return res.status(404).json({ message: "Travel package not inserted" });
  }

  return res.status(200).json({ travelPackage: newPackage });
};

// Get a travel package by ID
const getByPackageID = async (req, res, next) => {
  const id = req.params.id;

  let pkg;

  try {
    pkg = await TravelPackage.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!pkg) {
    return res.status(404).json({ message: "Travel package not available" });
  }

  return res.status(200).json({ travelPackage: pkg });
};

// Update a travel package
const updateTravelPackage = async (req, res, next) => {
  const id = req.params.id;
  const {
    packageId,
    packageName,
    packageDescription,
    packageType,
    destinations,
    duration,
    startDate,
    endDate,
    itinerary,
    inclusions,
    exclusions,
    availability,
    currency,
    price,
    transportType,
    travelImages,
  } = req.body;

  let pkg;
  try {
    pkg = await TravelPackage.findByIdAndUpdate(
      id,
      {
        packageId,
        packageName,
        packageDescription,
        packageType,
        destinations,
        duration,
        startDate,
        endDate,
        itinerary,
        inclusions,
        exclusions,
        availability,
        currency,
        price,
        transportType,
        travelImages,
      },
      { new: true, runValidators: true }
    );
  } catch (err) {
    console.log(err);
  }

  if (!pkg) {
    return res.status(404).json({ message: "Unable to update travel package" });
  }

  return res.status(200).json({ travelPackage: pkg });
};

// Delete a travel package
const deleteTravelPackage = async (req, res, next) => {
  const id = req.params.id;

  let pkg;
  try {
    pkg = await TravelPackage.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  if (!pkg) {
    return res.status(404).json({ message: "Unable to delete travel package" });
  }

  return res.status(200).json({ travelPackage: pkg });
};

// Export functions
exports.getAllTravelPackages = getAllTravelPackages;
exports.addTravelPackage = addTravelPackage;
exports.getByPackageID = getByPackageID;
exports.updateTravelPackage = updateTravelPackage;
exports.deleteTravelPackage = deleteTravelPackage;
