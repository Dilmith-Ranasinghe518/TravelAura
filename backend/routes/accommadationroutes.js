const express = require("express");
const router = express.Router();

// Controller
const accommodationControl = require("../controllers/accommadationcontroller");

// Routes
router.get("/", accommodationControl.getAllAccommodations);
router.post("/", accommodationControl.addAccommodation);
router.get("/:id", accommodationControl.getByAccommodationID);
router.put("/:id", accommodationControl.updateAccommodation);
router.delete("/:id", accommodationControl.deleteAccommodation);

// Export router
module.exports = router;
