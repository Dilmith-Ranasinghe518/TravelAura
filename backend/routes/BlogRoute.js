const express = require("express");
const router = express.Router();

//Insert Model
const Blog = require("../models/BlogModel");

//Insert blog Controller
const BlogController = require("../controllers/BlogController");

router.get("/",BlogController.getAllBlogs);
router.post("/",BlogController.addBlogs);
router.get("/:id",BlogController.getBlogsById);
router.put("/:id",BlogController.updateBlog);
router.delete("/:id", BlogController.deleteBlog);




//export
module.exports = router;

