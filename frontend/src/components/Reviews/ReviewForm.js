import React, { useState } from "react";
import { toast } from "react-toastify";

const ReviewForm = ({ onReviewAdded, onClose }) => {
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleAddReview = async (e) => {
    e.preventDefault();

    const reviewData = { name, destination, rating, comment };

    try {
      const response = await fetch("http://localhost:5001/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("✅ Review added successfully!");
        setName("");
        setDestination("");
        setRating(1);
        setComment("");

        if (onReviewAdded) onReviewAdded();
        if (onClose) onClose(); //  close after success
      } else {
        setError(result.message);
        toast.error(`❌ ${result.message}`);
      }
    } catch (err) {
      setError("Failed to add review");
      toast.error("❌ Failed to add review");
      console.error(err);
    }
  };

  const handleHover = (index) => setRating(index + 1);

  return (
    <div className="flex justify-center items-center py-6">
      <div className="relative bg-sky-50 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg font-bold"
        >
          ✖
        </button>

        <h2 className="text-amber-600 text-2xl sm:text-3xl font-bold text-center mb-6">
          Add Your Review
        </h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={handleAddReview} className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-gray-900 font-semibold text-sm sm:text-base">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full p-3 mt-1 border border-sky-200 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-sm sm:text-base"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="text-gray-900 font-semibold text-sm sm:text-base">
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter the destination name"
              required
              className="w-full p-3 mt-1 border border-sky-200 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-sm sm:text-base"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="text-gray-900 font-semibold text-sm sm:text-base">
              Rating
            </label>
            <div className="flex space-x-2 mt-2">
              {[1, 2, 3, 4, 5].map((star, index) => (
                <span
                  key={index}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => handleHover(index)}
                  onMouseLeave={() => setRating(star)}
                  className={`cursor-pointer text-2xl sm:text-3xl ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="text-gray-900 font-semibold text-sm sm:text-base">
              Your Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review"
              required
              rows="4"
              className="w-full p-3 mt-1 border border-sky-200 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-sm sm:text-base"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg shadow-md transition duration-300 text-sm sm:text-base"
          >
            Add Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
