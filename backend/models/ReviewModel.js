const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

    const ReviewSchema = new Schema(
  {
    name:        { type: String, required: true, trim: true, maxlength: 80 },
    destination: { type: String, required: true, trim: true, maxlength: 120 },
    rating:      { type: Number, required: true, min: 1, max: 5 },
    comment:     { type: String, required: true, trim: true, minlength: 20, maxlength: 2000 },
  });

  module.exports= mongoose.model(
    "ReviewModel",
    ReviewSchema
  )
