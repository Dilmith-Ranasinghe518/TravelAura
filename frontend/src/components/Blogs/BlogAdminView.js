import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminDashboard from "../AdminDashboard/admindash";


const BlogAdminView = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  // const navigate = useNavigate();

  // Fetch all blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5001/blogs");
        if (response.data && response.data.blogs) {
          setBlogs(response.data.blogs);
        } else {
          setError("No blogs found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch blogs");
      }
    };

    fetchBlogs();
  }, []);

  // Handle delete blog
  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`http://localhost:5001/blogs/${blogId}`);
      setBlogs(blogs.filter((b) => b._id !== blogId));
      alert("Blog deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog.");
    }
  };

  return (
     <div className="flex flex-col min-h-screen">
          <AdminDashboard>
        
            <main className="flex-grow">
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto py-12 px-6 sm:px-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Admin Blog Management
        </h2>

        {error && <p className="text-red-600 text-center mb-6">{error}</p>}

        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Author</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No blogs available
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{blog.title}</td>
                    <td className="px-6 py-4">{blog.category}</td>
                    <td className="px-6 py-4">{blog.author || "Unknown"}</td>
                    <td className="px-6 py-4 flex space-x-3">
                      {/* Edit button navigates to update page with blog ID */}
                      <Link to={`/update/${blog._id}`}>
                        <button className="text-teal-500 hover:text-teal-700">
                          Edit
                        </button>
                      </Link>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

     </main>
        </AdminDashboard>
        </div>  
  );
};

export default BlogAdminView;

