import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlogsNav from "../BlogsNav/BlogsNav";
import { Link } from 'react-router-dom';
import AdminDashboard from "../AdminDashboard/admindash";

const UpdateBlog = () => {
  const { id } = useParams(); // Get blog ID from URL
  const navigate = useNavigate();

  // State for form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Travel');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [author, setAuthor] = useState('Travel & Explore Community');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch existing blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5001/blogs/${id}`);
        const result = await response.json();

        if (response.ok && result.blog) {
          setTitle(result.blog.title);
          setCategory(result.blog.category);
          setContent(result.blog.content);
          setCoverImageUrl(result.blog.coverImageUrl || '');
          setAuthor(result.blog.author || 'Travel & Explore Community');
        } else {
          setError(result.message || 'Blog not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch blog data');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  // Handle form submission
  const handleUpdateBlog = async (e) => {
    e.preventDefault();

    const blogData = { title, category, content, coverImageUrl, author };

    try {
      const response = await fetch(`http://localhost:5001/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData)
      });

      const result = await response.json();

      if (response.ok) {
        alert('Blog updated successfully!');
        navigate(`/view-blog/${id}`);
      } else {
        setError(result.message || 'Unable to update blog');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update blog');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading blog data...</p>;

  return (
     <div className="flex flex-col min-h-screen">
             <AdminDashboard>
           
               <main className="flex-grow">
      <div className="bg-white min-h-screen flex justify-center items-center py-10">
        <div className="bg-sky-50 p-8 rounded-2xl shadow-xl w-full max-w-xl">
          <h2 className="text-amber-600 text-4xl font-bold text-center mb-8">Update Blog</h2>

          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

          <form onSubmit={handleUpdateBlog} className="space-y-6">
            <div>
              <label className="text-gray-900 font-semibold text-lg">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-4 mt-2 border border-sky-200 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
              />
            </div>

            <div>
              <label className="text-gray-900 font-semibold text-lg">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-4 mt-2 border border-sky-200 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
              >
                <option value="Travel">Travel</option>
                <option value="Adventure">Adventure</option>
                <option value="Events">Events</option>
                <option value="Food">Food</option>
              </select>
            </div>

            <div>
              <label className="text-gray-900 font-semibold text-lg">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="6"
                required
                className="w-full p-4 mt-2 border border-sky-200 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
              />
            </div>

            <div>
              <label className="text-gray-900 font-medium">Cover Image URL</label>
              <input
                type="text"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                className="w-full p-4 mt-2 border border-sky-200 rounded-lg focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-gray-900 font-semibold text-lg">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full p-4 mt-2 border border-sky-200 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
              />
            </div>

            <div className="flex space-x-4 mt-4">
              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg shadow-md transition duration-300"
              >
                Update Blog
              </button>

              <Link to="/view">
                <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg shadow-md transition duration-300">
                   View Blogs
                 </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
      </main>
      </AdminDashboard>
      </div>
  );
};

export default UpdateBlog;
