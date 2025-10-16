


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
//import BlogsNav from "../BlogsNav/BlogsNav";
import {Link} from "react-router-dom";
import AdminDashboard from "../AdminDashboard/admindash";


const AddBlog = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Travel');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [author, setAuthor] = useState('Travel & Explore Community');
  const [error, setError] = useState('');
  const [blogId, setBlogId] = useState(''); // State to hold the blog ID
  const navigate = useNavigate(); // To navigate to other pages

  const handleAddBlog = async (e) => {
    e.preventDefault();

    const blogData = {
      title,
      category,
      content,
      coverImageUrl,
      author
    };

    try {
      const response = await fetch('http://localhost:5001/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Blog added successfully!');
        setBlogId(result.blog._id); // Save the newly created blog's ID
        setTitle('');
        setContent('');
        setCoverImageUrl('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to add blog');
      console.error(err);
    }
  };

  const handleViewBlog = () => {
    if (blogId) {
      navigate(`/view-blog/${blogId}`); // Navigate to the blog detail page
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
         <AdminDashboard>
       
           <main className="flex-grow">

      <div className="bg-white min-h-screen flex justify-center items-center py-10"> 
        <div className="bg-sky-50 p-8 rounded-2xl shadow-xl w-full max-w-xl">
          <h2 className="text-amber-600 text-4xl font-bold text-center mb-8">Add Your Blog</h2>

          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

          <form onSubmit={handleAddBlog} className="space-y-6">
            <div>
              <label htmlFor="title" className="text-gray-900 font-semibold text-lg">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title"
                required
                className="w-full p-4 mt-2 border border-sky-200 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 ease-in-out"
              />
            </div>

            <div>
              <label htmlFor="category" className="text-gray-900 font-semibold text-lg">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-4 mt-2 border border-sky-200 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 ease-in-out"
              >
                <option value="Travel">Travel</option>
                <option value="Adventure">Adventure</option>
                <option value="Events">Events</option>
                <option value="Food">Food</option>
              </select>
            </div>

            <div>
              <label htmlFor="content" className="text-gray-900 font-semibold text-lg">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog content"
                required
                rows="6"
                className="w-full p-4 mt-2 border border-sky-200 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 ease-in-out"
              ></textarea>
            </div>

            <div>
              <label htmlFor="coverImageUrl" className="text-gray-900 font-medium">Cover Image URL</label>
              <input
                type="text"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="Paste image URL"
                className="w-full p-4 mt-2 border border-sky-200 rounded-lg focus:ring-sky-500"
              />
            </div>

            <div>
              <label htmlFor="author" className="text-gray-900 font-semibold text-lg">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author Name"
                className="w-full p-4 mt-2 border border-sky-200 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 ease-in-out"
              />
            </div>
          <div className="flex space-x-4 mt-4">
            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Add Blog
            </button>
            </div>
          </form>

            <Link to="/view">
              <button
                onClick={handleViewBlog}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg shadow-md transition duration-300 ease-in-out"
              >
                View Blog
              </button>
              </Link>
          
        </div>
      </div>
    
    </main>
    </AdminDashboard>
    </div>
    
    
  );
};

export default AddBlog;


