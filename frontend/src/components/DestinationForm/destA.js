import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function DestA({ destA }) {
  const { _id, destinationName, country, description, category, image } = destA;
  const history = useNavigate();

  const deleteHandler = async () => {
    try {
      await axios.delete(`http://localhost:5001/destinations/${_id}`);
      history("/");
      history("/destinationview");
    } catch (error) {
      console.error("Error deleting the destination:", error);
    }
  };

  return (
    <div
      className="relative isolate w-full rounded-[26px] bg-white 
                 shadow-[0_8px_28px_rgba(16,24,40,0.06)] 
                 border border-gray-100 
                 transition-transform duration-300 hover:scale-[1.01] 
                 hover:shadow-[0_16px_48px_rgba(16,24,40,0.10)]"
    >
      {/* Top aqua strip */}
      <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-[26px] bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400" />

      {/* Image */}
      <div className="pt-6 px-6 flex justify-center">
        <div
          className="aspect-square w-96   /* 384px */
                     rounded-[22px] overflow-hidden 
                     shadow-md ring-1 ring-cyan-100 
                     transition-transform duration-500 hover:scale-105"
        >
          <img
            src={
              image ||
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
            }
            alt={destinationName}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 pt-5 text-center">
        {/* Category */}
        <span className="inline-block mb-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
          {category}
        </span>

        {/* Title + country */}
        <h2 className="text-lg font-extrabold tracking-tight text-gray-900">
          {destinationName}
        </h2>
        <p className="text-sm text-gray-600">{country}</p>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-500 line-clamp-3">{description}</p>

        {/* "More" link */}
        <div className="mt-3">
          <Link
            to={`/destmore`}
            className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gray-700 hover:text-sky-700 hover:underline underline-offset-4"
          >
            More
          </Link>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-center gap-3">
          <Link
            to={`/destinationview/${_id}`}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm font-semibold shadow-sm hover:from-sky-600 hover:to-indigo-700"
          >
            Update
          </Link>
          <button
            onClick={deleteHandler}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-red-600 text-white text-sm font-semibold shadow-sm hover:from-rose-600 hover:to-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default DestA;
