import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="text-lg sm:text-xl font-extrabold tracking-tight">
          <Link
            to="/"
            className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-teal-500"
          >
            Travel &amp; Explore
          </Link>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-sky-600 transition">
            Home
          </Link>
          <Link to="/destinationsuser" className="hover:text-sky-600 transition">
            Destinations
          </Link>
          <Link to="/events" className="hover:text-sky-600 transition">
            Events &amp; Festivals
          </Link>
          <Link to="/useraccommodations" className="hover:text-sky-600 transition">
            Accommodations
          </Link>
          <Link to="/usertravelpackages" className="hover:text-sky-600 transition">
            Travel Packages
          </Link>
          <Link to="/viewblog" className="hover:text-sky-600 transition">
            Blogs 
          </Link>

           <Link to="/viewreview" className="hover:text-sky-600 transition">
            Reviews
          </Link>

          <Link to="/contact" className="hover:text-sky-600 transition">
            Contact
          </Link>
          <Link to="/about" className="hover:text-sky-600 transition">
            About Us
          </Link>

          {/* Profile icon → Register page */}
          <Link
            to="/register"
            className="ml-2 inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 hover:border-sky-300 hover:bg-sky-50 transition"
            aria-label="Profile / Register"
            title="Profile / Register"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}