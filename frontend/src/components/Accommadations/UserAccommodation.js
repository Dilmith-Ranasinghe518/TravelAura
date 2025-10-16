import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import Nav from "../Nav/Navbar";
import "./AccommodationUserPage.css";
import Header from "../Header/header";
import Fotter from "../Fotter/fotter";


// Image slider component
function UserAccommodationSlider({ images, name }) {
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
      <div className="user-accommodation-image-placeholder">
        <span>No Image Available</span>
      </div>
    );
  }

  return (
    <div 
      className="user-accommodation-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="user-slider-controls">
        <button
          className="user-slider-btn"
          onClick={() => setIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
        >
          ◀
        </button>
        <img
          src={images[index]}
          alt={`${name} ${index + 1}`}
          className="user-accommodation-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/350x220?text=Image+Error";
          }}
        />
        <button
          className="user-slider-btn"
          onClick={() => setIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
        >
          ▶
        </button>
      </div>

      <div className="user-slider-dots">
        {images.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            className={`user-slider-dot ${i === index ? "active" : ""}`}
          ></span>
        ))}
      </div>
    </div>
  );
}

function AccommodationUserPage() {
  const [accommodations, setAccommodations] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const sriLankaCities = [
    "All", "Colombo", "Kandy", "Galle", "Jaffna", "Negombo", 
    "Trincomalee", "Anuradhapura", "Nuwara Eliya", "Matara", 
    "Kurunegala", "Batticaloa", "Ratnapura", "Hambantota"
  ];

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5001/accommodation");
        const data = await response.json();
        setAccommodations(data.accommodations || []);
      } catch (err) {
        console.error("Error fetching accommodations:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccommodations();
  }, []);

  // Filter logic
  const filteredAccommodations = accommodations.filter((acc) => {
    const matchesSearch =
      acc.accommodationName.toLowerCase().includes(search.toLowerCase()) ||
      acc.description.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      filterType === "All" ||
      acc.type.toLowerCase() === filterType.toLowerCase();

    const matchesLocation =
      filterLocation === "All" ||
      acc.location.toLowerCase() === filterLocation.toLowerCase();

    const matchesPrice =
      acc.pricePerNight >= priceRange[0] &&
      acc.pricePerNight <= priceRange[1];

    return matchesSearch && matchesType && matchesLocation && matchesPrice;
  });

  return (
    <div className="user-accommodation-page">

      <Header />
      {/* <Nav /> */}
      
      {/* Hero Section */}
      <section className="user-accommodation-hero">
        <div className="user-hero-overlay">
          <h1 className="user-hero-title">Find Your Perfect Stay</h1>
          <p className="user-hero-subtitle">Discover amazing accommodations across Sri Lanka</p>
        </div>
      </section>

      {/* Filters Section */}
      <div className="user-filters-container">
        <div className="user-filters-header">
          <h2>Search Accommodations</h2>
          <p>Filter by your preferences</p>
        </div>
        
        <div className="user-filters-grid">
          <div className="user-filter-group">
            <input
              type="text"
              placeholder="Search accommodations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="user-filter-input"
            />
          </div>

          <div className="user-filter-group">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="user-filter-select"
            >
              <option value="All">All Types</option>
              <option value="Hotel">Hotel</option>
              <option value="Villa">Villa</option>
              <option value="Resort">Resort</option>
              <option value="Apartment">Apartment</option>
              <option value="Hostel">Hostel</option>
              <option value="Guesthouse">Guesthouse</option>
            </select>
          </div>

          <div className="user-filter-group">
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="user-filter-select"
            >
              {sriLankaCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="user-filter-group user-price-filter">
            <label>Max Price: Rs.{priceRange[1].toLocaleString()}</label>
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              className="user-price-slider"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="user-results-count">
        {isLoading ? "Loading accommodations..." : `Found ${filteredAccommodations.length} accommodations`}
      </div>

      {/* Accommodations List */}
      {isLoading ? (
        <div className="user-loading-container">
          <div className="user-loading-spinner"></div>
          <p>Loading accommodations...</p>
        </div>
      ) : (
        <div className="user-accommodation-grid">
          {filteredAccommodations.length > 0 ? (
            filteredAccommodations.map((acc) => (
              <div key={acc._id} className="user-accommodation-card">
                <div className="user-card-header">
                  <span className={`user-status-badge ${acc.availability ? 'available' : 'unavailable'}`}>
                    {acc.availability ? 'Available' : 'Unavailable'}
                  </span>
                  <span className="user-type-badge">{acc.type}</span>
                </div>
                
                <UserAccommodationSlider
                  images={acc.images}
                  name={acc.accommodationName}
                />

                <div className="user-card-content">
                  <h3 className="user-accommodation-name">{acc.accommodationName}</h3>
                  <p className="user-accommodation-description">{acc.description}</p>
                  
                  <div className="user-accommodation-details">
                    <div className="user-detail-item">
                      <span className="user-detail-icon">📍</span>
                      <span className="user-detail-text">{acc.location}</span>
                    </div>
                    
                    <div className="user-detail-item">
                      <span className="user-detail-icon">💰</span>
                      <span className="user-detail-price">Rs. {acc.pricePerNight.toLocaleString()} {acc.currency}/night</span>
                    </div>
                    
                    {acc.amenities && acc.amenities.length > 0 && (
                      <div className="user-detail-item">
                        <span className="user-detail-icon">⭐</span>
                        <span className="user-detail-text">{acc.amenities.join(", ")}</span>
                      </div>
                    )}
                    
                    {acc.roomType && acc.roomType.length > 0 && (
                      <div className="user-detail-item">
                        <span className="user-detail-icon">🛏️</span>
                        <span className="user-detail-text">{acc.roomType.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="user-card-actions">
                  <button
                    className={`user-book-btn ${acc.availability ? "" : "disabled"}`}
                    disabled={!acc.availability}
                    onClick={() => navigate("/booking-form", { state: acc })}
                  >
                    {acc.availability ? "Book Now" : "Unavailable"}
                    {acc.availability && <span className="btn-arrow">→</span>}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="user-no-results">
              <div className="user-no-results-icon">🏨</div>
              <h3>No accommodations found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      )}
 <Fotter />  
   </div>
  );
}

export default AccommodationUserPage;