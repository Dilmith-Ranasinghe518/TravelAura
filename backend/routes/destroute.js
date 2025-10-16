const express = require("express");
const router = express.Router();

// Controller
const destinationControl = require("../controllers/destcontrol");

// Routes
router.get("/", destinationControl.getAllDestinations);
router.post("/", destinationControl.addDestination); // ✅ fixed name
router.get("/:id", destinationControl.getByDestID);  // ✅ fixed name
router.put("/:id", destinationControl.updatedestination);  // ✅ fixed name
router.delete("/:id", destinationControl.deletedestination);  // ✅ fixed name



// Export router
module.exports = router;
