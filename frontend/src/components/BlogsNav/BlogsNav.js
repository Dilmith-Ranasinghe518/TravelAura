import React from 'react';
import {Link} from "react-router-dom";

function Nav() {
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">My Site</h1>

      <div className="flex gap-4">
        <Link to="/viewblog">
        <button className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600">
          View Blogs
        </button>
        </Link>
        <Link to="/addreview">
        <button className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600">
          Add Review
        </button>
        </Link>
        <Link to="/addblog">
        <button className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600">
          Add Blog
        </button>
        </Link>
        <Link to="/viewreview">
        <button className="px-4 py-2 rounded bg-green-500 hover:bg-green-600">
          View all Reviews
        </button>
        </Link>
      </div>
    </div>
  );
}

export default Nav
