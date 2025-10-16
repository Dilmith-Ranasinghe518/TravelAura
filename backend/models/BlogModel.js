const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
   category: {
      type: String,
      required: true,
      trim: true,
      enum: ["Travel", "Adventure", "Events", "Food"],
      default: "Travel",
    },

    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 50,     
      maxlength: 20000,  
    },
    coverImageUrl: {
      type: String,
      trim: true,        
    },
    author: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "Travel & Explore Community",
    },
   
  },
  
);

module.exports = mongoose.model("BlogModel", BlogSchema);
