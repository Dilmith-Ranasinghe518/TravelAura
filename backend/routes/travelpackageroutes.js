const express = require("express");
const router = express.Router();

// Controller
const travelPackageControl = require("../controllers/travelpackagecontroller");

// Routes
router.get("/", travelPackageControl.getAllTravelPackages);
router.post("/", travelPackageControl.addTravelPackage);
router.get("/:id", travelPackageControl.getByPackageID);
router.put("/:id", travelPackageControl.updateTravelPackage);
router.delete("/:id", travelPackageControl.deleteTravelPackage);

// Export router
module.exports = router;
