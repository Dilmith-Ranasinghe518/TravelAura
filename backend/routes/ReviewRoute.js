const express = require("express");
const router = express.Router();

//Insert Model
const Review = require("../models/ReviewModel");

//Insert Review Controller
const ReviewController = require("../controllers/ReviewController");

router.get("/",ReviewController.getAllReviews);
router.post("/",ReviewController.addReviews);

//export
module.exports = router;
