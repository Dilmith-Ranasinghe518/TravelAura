const Blog = require("../models/BlogModel");

const getAllBlogs = async(req, res, next)=>{
    let blogs;

     //Get All Blogs
        try{
            blogs = await Blog.find();
        }catch (err){
            console.log(err);
        }

        //not FOund
    if(!blogs){
        return res.status(404).json({message:"Blogs not found"});
    }

    //Display all blogs
    return res.status(200).json({blogs});

};

//data insert
    const addBlogs = async(req, res, next) =>{
        const {title,category,content,coverImageUrl,author } = req.body;

        let blogs;

        try{
            blogs = new Blog({title,category,content,coverImageUrl,author});
            await blogs.save();
        }catch (err) {
            console.log(err);
        }

    //not insert blogs
    if(!blogs){
       return res.status(404).send({message:"unable to add blogs"});
    }
    return res.status(200).json({blogs});
    };

   
   
    // Get an Blogs by ID
const getBlogsById = async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "blog not found" });
        }
        return res.status(200).json({ blog });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching blog" });
    }
};

// Update Blogs
 const updateBlog = async (req, res, next) => {
    const { id } = req.params;
    const { title, category, content, coverImageUrl, author } = req.body;

    try {
        // Find blog by ID and update it
        const blog = await Blog.findByIdAndUpdate(
            id,
            { title, category, content, coverImageUrl, author },
            { new: true } // <-- Return the updated document
        );

        if (!blog) {
            return res.status(404).json({ message: "Blog not found or unable to update" });
        }

        // Return the updated blog
        return res.status(200).json({ blog });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating blog" });
    }
};

// Delete Blog by ID
const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found or already deleted" });
    }

    return res.status(200).json({ message: "Blog deleted successfully", blog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error deleting blog" });
  }
};



exports.getAllBlogs = getAllBlogs;
exports.addBlogs = addBlogs;
exports.getBlogsById = getBlogsById;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;






