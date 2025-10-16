import React, { useState, useEffect } from "react";
import ReviewForm from "./ReviewForm"; // import the form
import Header from "../Header/header";
import Fotter from "../Fotter/fotter";


const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("rating"); // Default to rating
  const [showModal, setShowModal] = useState(false); // modal toggle

  // fetch reviews function
  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:5001/reviews");
      const result = await response.json();
      if (response.ok) {
        setReviews(result.reviews);
        setFilteredReviews(result.reviews);
      } else {
        setError("No reviews found");
      }
    } catch (err) {
      setError("Failed to fetch reviews");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSortChange = (event) => {
    const sortValue = event.target.value;
    setSortBy(sortValue);

    if (sortValue === "rating") {
      const sorted = [...reviews].sort((a, b) => b.rating - a.rating);
      setFilteredReviews(sorted);
    } else if (sortValue === "recentlyAdded") {
      const sorted = [...reviews].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setFilteredReviews(sorted);
    }
  };

  return (

    <div>
       <Header />
    <div className="bg-white min-h-screen py-12 px-6 sm:px-16">
     
      {/* Top Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          From their trip to{" "}
          <span className="text-amber-600 font-extrabold">your tips</span>
        </h2>
        <p className="text-gray-600 mt-2">
          <span className="text-green-600 font-semibold">★ TripRated</span>{" "}
          Based on {reviews.length} reviews
        </p>
      </div>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {/* Sorting + Add Review Button */}
      <div className="flex justify-center items-center gap-6 mb-8">
        <div>
          <label className="text-gray-700 mr-2">Sort By:</label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="px-4 py-2 rounded-lg border border-sky-500"
          >
            <option value="rating">Rating (High to Low)</option>
            <option value="recentlyAdded">Recently Added</option>
          </select>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 shadow"
        >
          ➕ Add Your Review
        </button>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left side text */}
        <div className="lg:col-span-1 flex flex-col justify-center">
          <div className="text-left">
            <span className="text-5xl text-sky-200 font-serif">“</span>
            <h3 className="text-2xl font-semibold text-gray-900 leading-snug">
              What our <br /> customers are <br /> saying
            </h3>
          </div>
        </div>

        {/* Reviews */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full">
              No reviews available
            </p>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review._id}
                className="bg-sky-50 border border-sky-200 p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300"
              >
                <p className="text-gray-600 text-base leading-relaxed mb-4">
                  {review.comment}
                </p>

                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${
                        star <= review.rating
                          ? "text-green-600"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-sky-500 flex items-center justify-center mr-3 text-white font-bold">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {review.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Rating: {review.rating} stars
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <ReviewForm
      onReviewAdded={() => {
        fetchReviews();  // refresh list
        setShowModal(false);
      }}
      onClose={() => setShowModal(false)} // ✅ close manually
    />
  </div>
)}
     
    </div>
    <Fotter />
    </div>
  );
};

export default ReviewList;
