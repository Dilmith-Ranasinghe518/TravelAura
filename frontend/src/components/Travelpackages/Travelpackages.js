import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "../AdminDashboard/admindash";

// Image slider component
function ImageSlider({ images, name }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!images || images.length === 0 || paused) return;
    const interval = setInterval(() => {
      setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [images, paused]);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg w-full h-48">
        <span className="text-gray-500">No Image Available</span>
      </div>
    );
  }

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div
      className="relative w-full flex flex-col items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-center gap-2">
        <button 
          onClick={prev} 
          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
        >
          ◀
        </button>
        <img
          src={images[index]}
          alt={`${name} ${index + 1}`}
          className="w-full h-48 object-cover rounded-lg"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/300x200?text=Image+Error";
          }}
        />
        <button 
          onClick={next} 
          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
        >
          ▶
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex mt-2 gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full cursor-pointer ${i === index ? "bg-blue-600" : "bg-gray-400"}`}
          ></span>
        ))}
      </div>
    </div>
  );
}

function TravelPackagePage() {
  const [travelPackages, setTravelPackages] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterAvailability, setFilterAvailability] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, available: 0, unavailable: 0 });

  const navigate = useNavigate();

  // Fetch all packages
  useEffect(() => {
    const fetchTravelPackages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5001/travelpackage");
        const data = await response.json();
        if (data.packages) {
          setTravelPackages(data.packages);
          const total = data.packages.length;
          const available = data.packages.filter(pkg => pkg.availability).length;
          const unavailable = total - available;
          setStats({ total, available, unavailable });
        }
      } catch (err) {
        console.error("Error fetching travel packages:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTravelPackages();
  }, []);

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      const res = await fetch(`http://localhost:5001/travelpackage/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Package deleted successfully");
        setTravelPackages((prev) => prev.filter((pkg) => pkg._id !== id));
        setStats(prev => ({
          total: prev.total - 1,
          available: prev.available - (travelPackages.find(p => p._id === id)?.availability ? 1 : 0),
          unavailable: prev.unavailable - (travelPackages.find(p => p._id === id)?.availability ? 0 : 1)
        }));
      } else {
        alert("Failed to delete package");
      }
    } catch (err) {
      console.error("Error deleting travel package:", err);
    }
  };

  // Sri Lanka cities
  const sriLankaCities = ["All", "Colombo", "Kandy", "Galle", "Nuwara Eliya", "Anuradhapura", "Jaffna", "Trincomalee", "Negombo", "Matara", "Polonnaruwa", "Batticaloa"];

  // Filtering logic
  const filteredPackages = travelPackages.filter((pkg) => {
    const matchesSearch =
      pkg.packageName.toLowerCase().includes(search.toLowerCase()) ||
      pkg.packageDescription.toLowerCase().includes(search.toLowerCase()) ||
      pkg.packageType.toLowerCase().includes(search.toLowerCase()) ||
      pkg.destinations.some((d) => d.toLowerCase().includes(search.toLowerCase()));

    const matchesType = filterType === "All" || pkg.packageType.toLowerCase() === filterType.toLowerCase();
    const matchesAvailability = filterAvailability === "All" || (filterAvailability === "Available" && pkg.availability) || (filterAvailability === "Not Available" && !pkg.availability);
    const matchesLocation = filterLocation === "All" || pkg.destinations.some((d) => d.toLowerCase() === filterLocation.toLowerCase());
    const matchesPrice = pkg.price >= priceRange[0] && pkg.price <= priceRange[1];

    return matchesSearch && matchesType && matchesAvailability && matchesLocation && matchesPrice;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <AdminDashboard>
        <main className="flex-grow p-6">
          {/* Header with travel theme */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">Travel Packages</h1>
            <p className="text-blue-600">Discover and manage amazing travel experiences across Sri Lanka</p>
          </div>

          {/* Stats Overview with travel-themed styling */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-lg border border-blue-100">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl text-blue-600">📦</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-800">{stats.total}</h3>
                <p className="text-sm text-blue-600">Total Packages</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-lg border border-green-100">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl text-green-600">✅</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-800">{stats.available}</h3>
                <p className="text-sm text-green-600">Available</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-lg border border-red-100">
              <div className="p-3 bg-red-100 rounded-full">
                <span className="text-2xl text-red-600">❌</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-800">{stats.unavailable}</h3>
                <p className="text-sm text-red-600">Unavailable</p>
              </div>
            </div>
          </div>

          {/* Filters Section with travel theme */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="text-xl font-semibold text-blue-800">Filter Packages</h3>
              <button 
                onClick={() => navigate("/inserttravelpackage")} 
                className="px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md flex items-center gap-2"
              >
                <span>+</span> Create New Package
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm mb-2 text-blue-700 font-medium">Search</label>
                <input
                  type="text"
                  placeholder="Search packages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-blue-700 font-medium">Package Type</label>
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)} 
                  className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                >
                  <option value="All">All Types</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Family">Family</option>
                  <option value="Honeymoon">Honeymoon</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Beach">Beach</option>
                  <option value="Wildlife">Wildlife</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 text-blue-700 font-medium">Availability</label>
                <select 
                  value={filterAvailability} 
                  onChange={(e) => setFilterAvailability(e.target.value)} 
                  className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                >
                  <option value="All">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 text-blue-700 font-medium">Destination</label>
                <select 
                  value={filterLocation} 
                  onChange={(e) => setFilterLocation(e.target.value)} 
                  className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                >
                  {sriLankaCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-sm mb-2 text-blue-700 font-medium">
                  Price Range: Rs.{priceRange[0].toLocaleString()} - Rs.{priceRange[1].toLocaleString()}
                </label>
                <div className="flex gap-4 items-center">
                  <input 
                    type="range" 
                    min="0" 
                    max="100000" 
                    step="1000" 
                    value={priceRange[0]} 
                    onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])} 
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <input 
                    type="range" 
                    min="0" 
                    max="100000" 
                    step="1000" 
                    value={priceRange[1]} 
                    onChange={(e) => setPriceRange([priceRange[0], +e.target.value])} 
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-4 text-sm text-blue-600 font-medium">
            Showing {filteredPackages.length} of {travelPackages.length} packages
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-blue-600">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
              <p>Loading travel packages...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.length > 0 ? (
                filteredPackages.map((pkg) => (
                  <div key={pkg._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100 transition-transform duration-300 hover:scale-[1.02]">
                    <div className="flex justify-between items-center px-4 py-3 bg-blue-50">
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${pkg.availability ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {pkg.availability ? "Available" : "Not Available"}
                      </span>
                      <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-semibold">{pkg.packageType}</span>
                    </div>

                    <ImageSlider images={pkg.travelImages} name={pkg.packageName} />

                    <div className="p-5">
                      <h3 className="font-bold text-xl text-blue-800 mb-2">{pkg.packageName}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pkg.packageDescription}</p>

                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2">
                          <span className="text-blue-600">⏱️</span>
                          <span className="font-medium text-blue-700">Duration:</span> 
                          <span className="text-gray-700">{pkg.duration}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-blue-600">📅</span>
                          <span className="font-medium text-blue-700">Dates:</span> 
                          <span className="text-gray-700">{new Date(pkg.startDate).toLocaleDateString()} – {new Date(pkg.endDate).toLocaleDateString()}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-blue-600">💰</span>
                          <span className="font-medium text-blue-700">Price:</span> 
                          <span className="text-gray-700">Rs. {pkg.price.toLocaleString()} {pkg.currency}</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">📍</span>
                          <span>
                            <span className="font-medium text-blue-700">Destinations:</span> 
                            <span className="text-gray-700"> {pkg.destinations.join(", ")}</span>
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between border-t border-blue-100 px-5 py-4 bg-blue-50">
                      <button 
                        onClick={() => navigate(`/travelpackageupdate/${pkg._id}`)} 
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
                      >
                        <span>✏️</span> Update
                      </button>
                      <button 
                        onClick={() => handleDelete(pkg._id)} 
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
                      >
                        <span>🗑️</span> Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-blue-600">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="font-bold text-xl mb-2">No packages found</h3>
                  <p className="text-center">Try adjusting your filters or create a new package</p>
                </div>
              )}
            </div>
          )}
        </main>
      </AdminDashboard>
    </div>
  );
}

export default TravelPackagePage;