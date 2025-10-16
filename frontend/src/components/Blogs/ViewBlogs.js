// import React, { useState, useEffect } from "react";

// const ViewBlogs = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [filteredBlogs, setFilteredBlogs] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/blogs");
//         const result = await response.json();
//         if (response.ok) {
//           setBlogs(result.blogs);
//           setFilteredBlogs(result.blogs);

//           // Collect unique categories for the dropdown
//           const uniqueCategories = [
//             ...new Set(result.blogs.map((blog) => blog.category)),
//           ];
//           setCategories(uniqueCategories);
//         } else {
//           setError("No blogs found");
//         }
//       } catch (err) {
//         setError("Failed to fetch blogs");
//         console.error(err);
//       }
//     };

//     fetchBlogs();
//   }, []);

//   const handleCategoryChange = (event) => {
//     const category = event.target.value;
//     setSelectedCategory(category);

//     if (category === "") {
//       setFilteredBlogs(blogs); // Show all blogs if "All Categories" is selected
//     } else {
//       const filtered = blogs.filter((blog) => blog.category === category);
//       setFilteredBlogs(filtered); // Filter blogs by selected category
//     }
//   };

//   return (
//     <div className="bg-white min-h-screen">
//       {/* 🌊 Splash Section for Blogs */}
//       <div
//         className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')",
//         }}
//       >
//         <div className="absolute inset-0 bg-black/40"></div>
//         <div className="relative text-center text-white px-6">
//           <h1 className="text-4xl sm:text-5xl font-bold mb-4">
//             Explore Inspiring Stories
//           </h1>
//           <p className="text-lg sm:text-xl max-w-2xl mx-auto">
//             Dive into blogs written by our riders and community. From travel
//             diaries to expert tips – all in one place.
//           </p>
//         </div>
//       </div>

//       {/* 📝 Blog List Section */}
//       <div className="bg-sky-50 py-12 px-6 sm:px-16">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
//             Latest Blogs
//           </h2>

//           {/* Category Dropdown */}
//           <div className="mb-6 text-center">
//             <select
//               value={selectedCategory}
//               onChange={handleCategoryChange}
//               className="bg-teal-500 text-white px-4 py-2 rounded-lg"
//             >
//               <option value="">All Categories</option>
//               {categories.map((category) => (
//                 <option key={category} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {error && (
//             <p className="text-red-600 text-center mb-6">{error}</p>
//           )}

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredBlogs.length === 0 ? (
//               <p className="text-center text-gray-600 col-span-full">
//                 No blogs available
//               </p>
//             ) : (
//               filteredBlogs.map((blog) => (
//                 <div
//                   key={blog._id}
//                   className="bg-white rounded-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-500"
//                 >
//                   {/* ✅ Display user-submitted image */}
//                   <img
//                     src={
//                       blog.coverImageUrl ||
//                       "https://via.placeholder.com/400x250?text=No+Image"
//                     }
//                     alt={blog.title}
//                     className="h-64 w-full object-cover transition-transform duration-500 transform hover:scale-110"
//                   />

//                   {/* Blog Content */}
//                   <div className="p-6">
//                     {/* Category Tag */}
//                     <div className="bg-teal-500 text-white text-xs font-semibold py-1 px-3 rounded-full mb-3 inline-block">
//                       {blog.category}
//                     </div>

//                     {/* Blog Title */}
//                     <h3 className="text-2xl font-semibold text-gray-900 mb-4 hover:text-teal-600 transition duration-300">
//                       {blog.title}
//                     </h3>

//                     {/* Blog Content */}
//                     <p className="text-gray-700 mb-4 line-clamp-3">
//                       {blog.content}
//                     </p>

//                     {/* Author */}
//                     <div className="text-sm text-gray-500">
//                       ✍️ {blog.author || "Unknown Author"}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewBlogs;



// import React, { useState, useEffect } from "react";

// const ViewBlogs = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [filteredBlogs, setFilteredBlogs] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/blogs");
//         const result = await response.json();
//         if (response.ok) {
//           setBlogs(result.blogs);
//           setFilteredBlogs(result.blogs);

//           const uniqueCategories = [
//             ...new Set(result.blogs.map((blog) => blog.category)),
//           ];
//           setCategories(uniqueCategories);
//         } else {
//           setError("No blogs found");
//         }
//       } catch (err) {
//         setError("Failed to fetch blogs");
//         console.error(err);
//       }
//     };

//     fetchBlogs();
//   }, []);

//   const handleCategoryChange = (event) => {
//     const category = event.target.value;
//     setSelectedCategory(category);

//     if (category === "") {
//       setFilteredBlogs(blogs);
//     } else {
//       const filtered = blogs.filter((blog) => blog.category === category);
//       setFilteredBlogs(filtered);
//     }
//   };

//   return (
//     <div className="bg-white min-h-screen">
//       {/* 🌊 Splash Section */}
//       <div
//         className="relative h-[50vh] flex items-center justify-center bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80')",
//         }}
//       >
//         <div className="absolute inset-0 bg-black/40"></div>
//         <div className="relative text-center text-white px-6">
//           <h1 className="text-5xl font-bold mb-3">Lifestyle Blogs</h1>
//           <p className="text-lg sm:text-xl max-w-2xl mx-auto">
//             Inspiring stories, expert tips, and unique journeys from our
//             community.
//           </p>
//         </div>
//       </div>

//       {/* 📝 Blog List Section */}
//       <div className="bg-gray-50 py-16 px-6 sm:px-12">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">
//             Latest Articles
//           </h2>

//           {/* Category Dropdown */}
//           <div className="mb-10 text-center">
//             <select
//               value={selectedCategory}
//               onChange={handleCategoryChange}
//               className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400"
//             >
//               <option value="">All Categories</option>
//               {categories.map((category) => (
//                 <option key={category} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {error && (
//             <p className="text-red-600 text-center mb-6">{error}</p>
//           )}

//           {/* Blog Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
//             {filteredBlogs.length === 0 ? (
//               <p className="text-center text-gray-600 col-span-full">
//                 No blogs available
//               </p>
//             ) : (
//               filteredBlogs.map((blog) => (
//                 <div
//                   key={blog._id}
//                   className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
//                 >
//                   {/* Background Image */}
//                   <img
//                     src={
//                       blog.coverImageUrl ||
//                       "https://via.placeholder.com/400x250?text=No+Image"
//                     }
//                     alt={blog.title}
//                     className="h-64 w-full object-cover transform group-hover:scale-110 transition duration-500"
//                   />

//                   {/* Overlay */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

//                   {/* Text Content */}
//                   <div className="absolute bottom-4 left-4 right-4 text-white">
//                     <div className="text-xs uppercase tracking-wide font-semibold text-teal-300 mb-2">
//                       {blog.category}
//                     </div>
//                     <h3 className="text-xl font-bold mb-2 group-hover:text-teal-300 transition">
//                       {blog.title}
//                     </h3>
//                     <p className="text-sm text-gray-200 line-clamp-2 mb-2">
//                       {blog.content}
//                     </p>
//                     <div className="text-xs text-gray-300">
//                       ✍️ {blog.author || "Unknown Author"}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewBlogs;


import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Header from "../Header/header";
import Fotter from "../Fotter/fotter";


// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const ViewBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5001/blogs");
        const result = await response.json();
        if (response.ok) {
          setBlogs(result.blogs);
          setFilteredBlogs(result.blogs);

          const uniqueCategories = [
            ...new Set(result.blogs.map((blog) => blog.category)),
          ];
          setCategories(uniqueCategories);
        } else {
          setError("No blogs found");
        }
      } catch (err) {
        setError("Failed to fetch blogs");
        console.error(err);
      }
    };

    fetchBlogs();
  }, []);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);

    if (category === "") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter((blog) => blog.category === category);
      setFilteredBlogs(filtered);
    }
  };

  return (
    <div>
      <Header />
    <div className="bg-white min-h-screen">
      {/* 🌊 Splash Section with Swiper */}
      <div className="relative h-[70vh] w-full">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop={true}
          className="h-full w-full"
        >
          {/* Slides - Sri Lanka Travel Images */}
          <SwiperSlide>
            <div
              className="h-full w-full bg-cover bg-center flex items-center justify-center relative"
              style={{
                backgroundImage:
                  "url('https://i.pinimg.com/1200x/19/6d/32/196d32622478b8bb6f349a4dc1b33b0e.jpg')",
              }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative text-center text-white px-6">
                <h1 className="text-5xl font-bold mb-3">Discover Sri Lanka</h1>
                <p className="text-lg sm:text-xl max-w-2xl mx-auto">
                  From pristine beaches to lush mountains – explore the island like never before.
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div
              className="h-full w-full bg-cover bg-center flex items-center justify-center relative"
              style={{
                backgroundImage:
                  "url('https://i.pinimg.com/1200x/4a/37/82/4a3782a9a96b9df632127dc6a8d9596b.jpg')",
              }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative text-center text-white px-6">
                <h1 className="text-5xl font-bold mb-3">Celebrate Sri Lanka</h1>
                <p className="text-lg sm:text-xl max-w-2xl mx-auto">
                Join colorful festivals and cultural events across the island.
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div
              className="h-full w-full bg-cover bg-center flex items-center justify-center relative"
              style={{
                backgroundImage:
                  "url('https://i.pinimg.com/1200x/cb/ec/44/cbec44bc75385115dc872b5a8c5a18f2.jpg')",
              }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative text-center text-white px-6">
                <h1 className="text-5xl font-bold mb-3">Explore Nature</h1>
                <p className="text-lg sm:text-xl max-w-2xl mx-auto">
                  Wildlife, safaris, and breathtaking landscapes.
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div
              className="h-full w-full bg-cover bg-center flex items-center justify-center relative"
              style={{
                backgroundImage:
                  "url('https://i.pinimg.com/1200x/2c/6c/72/2c6c7226c53c22f597a8a1ca4648fdf6.jpg')",
              }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative text-center text-white px-6">
                <h1 className="text-5xl font-bold mb-3">Savor Authentic Flavors</h1>
                <p className="text-lg sm:text-xl max-w-2xl mx-auto">
                  Indulge in Sri Lanka’s vibrant culinary heritage – a feast for your senses.
                </p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* 📝 Blog List Section */}
      <div className="bg-gray-50 py-16 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">
            Latest Articles
          </h2>

          {/* Category Dropdown */}
          <div className="mb-10 text-center">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-red-600 text-center mb-6">{error}</p>
          )}

          {/* Blog Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredBlogs.length === 0 ? (
              <p className="text-center text-gray-600 col-span-full">
                No blogs available
              </p>
            ) : (
              filteredBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
                >
                  {/* Background Image */}
                  <img
                    src={
                      blog.coverImageUrl ||
                      "https://via.placeholder.com/400x250?text=No+Image"
                    }
                    alt={blog.title}
                    className="h-64 w-full object-cover transform group-hover:scale-110 transition duration-500"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                  {/* Text Content */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs uppercase tracking-wide font-semibold text-teal-300 mb-2">
                      {blog.category}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-teal-300 transition">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-200 line-clamp-2 mb-2">
                      {blog.content}
                    </p>
                    <div className="text-xs text-gray-300">
                      ✍️ {blog.author || "Unknown Author"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
    <Fotter />
    </div>
  );
};

export default ViewBlogs;
