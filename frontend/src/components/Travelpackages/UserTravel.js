import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//import Nav from "../Nav/Navbar";
import "./TravelPackagesUserPage.css";

import Header from "../Header/header";
import Fotter from "../Fotter/fotter";

function TravelPackagesUserPage() {
  const [travelPackages, setTravelPackages] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const sriLankaCities = [
    "All", "Colombo", "Kandy", "Galle", "Nuwara Eliya", "Jaffna", "Anuradhapura",
    "Polonnaruwa", "Trincomalee", "Negombo", "Ella", "Matara", "Hambantota",
    "Batticaloa", "Kurunegala",
  ];

  useEffect(() => {
    const fetchTravelPackages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5001/travelpackage");
        const data = await response.json();
        if (data.packages) {
          setTravelPackages(data.packages);
        }
      } catch (err) {
        console.error("Error fetching travel packages:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTravelPackages();
  }, []);

  // ✅ Filtering
  const filteredPackages = travelPackages.filter((pkg) => {
    const matchesSearch =
      pkg.packageName.toLowerCase().includes(search.toLowerCase()) ||
      pkg.packageDescription.toLowerCase().includes(search.toLowerCase()) ||
      pkg.destinations.some((d) =>
        d.toLowerCase().includes(search.toLowerCase())
      );

    const matchesType =
      filterType === "All" ||
      pkg.packageType.toLowerCase() === filterType.toLowerCase();

    const matchesLocation =
      filterLocation === "All" ||
      pkg.destinations.some(
        (d) => d.toLowerCase() === filterLocation.toLowerCase()
      );

    const matchesPrice =
      pkg.price >= priceRange[0] && pkg.price <= priceRange[1];

    const pkgStart = new Date(pkg.startDate);
    const pkgEnd = new Date(pkg.endDate);
    const matchesDate =
      (!fromDate || pkgStart >= new Date(fromDate)) &&
      (!toDate || pkgEnd <= new Date(toDate));

    return (
      matchesSearch &&
      matchesType &&
      matchesLocation &&
      matchesPrice &&
      matchesDate
    );
  });

  const navigate = useNavigate();

  // ✅ Book Now handler
  const handleBookNow = (pkg) => {
    if (!pkg.availability) return;
    alert(`Booking confirmed for ${pkg.packageName}! 🎉`);
     navigate("/booking-form", { state: pkg });
  };

  return (
    <div className="user-travel-page">
      {/* <Nav /> */}
      <Header/>

      {/* ===== Hero Banner ===== */}
      <section className="hero-banner">
        <div className="hero-overlay">
          <h1 className="animate-fade-in">Discover Sri Lanka</h1>
          <p className="animate-slide-up">Like Never Before!</p>
          <div className="hero-search">
            <input
              type="text"
              placeholder="Search destinations, experiences..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ===== Filters ===== */}
      <div className="user-travel-filters animate-fade-in">
        <div className="filter-section">
          <h3>Filter Packages</h3>
          <div className="filter-grid">
            <div className="filter-group">
              <label>Package Type</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Tour">Tour</option>
                <option value="Cruise">Cruise</option>
                <option value="Adventure">Adventure</option>
                <option value="Honeymoon">Honeymoon</option>
                <option value="Wildlife">Wildlife</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Destination</label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                {sriLankaCities.map((city, i) => (
                  <option key={i} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Max Price: Rs.{priceRange[1].toLocaleString()}</label>
              <input
                type="range"
                min="0"
                max="500000"
                step="1000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
              />
            </div>

            <div className="filter-group date-filters">
              <label>Date Range</label>
              <div className="date-inputs">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  placeholder="From"
                />
                <span>to</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  placeholder="To"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Special Offers ===== */}
      <section className="special-offers">
        <h2>Special Offers</h2>
        <div className="offer-cards">
          <div className="offer-card animate-float">
            <div className="offer-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80')"}}>
              <div className="offer-badge">25% OFF</div>
            </div>
            <div className="offer-content">
              <h4>Winter Beach Escape</h4>
              <p>Enjoy the sunny beaches of Sri Lanka with special discounts</p>
              <button className="offer-btn">View Deal</button>
            </div>
          </div>
          
          <div className="offer-card animate-float" style={{animationDelay: "0.2s"}}>
            <div className="offer-image" style={{backgroundImage: "url('https://i.pinimg.com/1200x/17/99/5c/17995c9c9a180eb6e99a39423586e7c5.jpg')"}}>
              <div className="offer-badge">From Rs.12,200</div>
            </div>
            <div className="offer-content">
              <h4>Mountain Retreat</h4>
              <p>Experience the cool climate of Nuwara Eliya hills</p>
              <button className="offer-btn">View Deal</button>
            </div>
          </div>
          
          <div className="offer-card animate-float" style={{animationDelay: "0.4s"}}>
            <div className="offer-image" style={{backgroundImage: "url('https://i.pinimg.com/1200x/77/1e/40/771e403434bf1a5f92397ed4bb8d64b9.jpg')"}}>
              <div className="offer-badge">Limited Time</div>
            </div>
            <div className="offer-content">
              <h4>Safari yala </h4>
              <p>Check out our exclusive weekly deals and promotions</p>
              <button className="offer-btn">View All</button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Packages ===== */}
      <section className="top-travel-places">
        <div className="section-header">
          <h2>Explore Travel Packages</h2>
          <p>Discover amazing destinations across Sri Lanka</p>
        </div>
        
        {isLoading ? (
          <div className="loading-packages">
            <div className="loading-spinner"></div>
            <p>Loading packages...</p>
          </div>
        ) : (
          <div className="user-travel-list">
            {filteredPackages.length > 0 ? (
              filteredPackages.map((pkg, index) => (
                <div 
                  key={pkg._id} 
                  className="user-travel-card animate-fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div 
                    className="user-travel-image-container"
                    style={{backgroundImage: `url(${pkg.travelImages?.[0] || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80"})`}}
                  >
                    <div className="card-overlay">
                      <span className="package-type">{pkg.packageType}</span>
                      {!pkg.availability && <span className="sold-out">Sold Out</span>}
                    </div>
                  </div>

                  <div className="user-travel-info">
                    <h3>{pkg.packageName}</h3>
                    <p className="user-travel-description">
                      {pkg.packageDescription}
                    </p>
                    <div className="package-details">
                      <div className="detail-item">
                        <span className="detail-icon">⏱</span>
                        <span>{pkg.duration}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <span>
                          {new Date(pkg.startDate).toLocaleDateString()} –{" "}
                          {new Date(pkg.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <span>{pkg.destinations.join(", ")}</span>
                      </div>
                    </div>
                    <div className="price-container">
                      <p className="user-travel-price">
                        Rs.{pkg.price.toLocaleString()} {pkg.currency}
                      </p>
                      <p className="availability-status">
                        {pkg.availability ? (
                          <span className="user-available">Available</span>
                        ) : (
                          <span className="user-unavailable">Not Available</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    className={`btn-book-now ${
                      pkg.availability ? "" : "disabled"
                    }`}
                    disabled={!pkg.availability}
                    onClick={() => handleBookNow(pkg)}
                  >
                    {pkg.availability ? "Book Now" : "Unavailable"}
                    {pkg.availability && <span className="btn-arrow">→</span>}
                  </button>
                </div>
              ))
            ) : (
              <div className="no-packages">
                <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="No results" />
                <h3>No packages found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ===== Newsletter Section ===== */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Get Travel Inspiration</h2>
          <p>Subscribe to our newsletter for exclusive deals and travel tips</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </section>
      <Fotter />
    </div>
  );
}

export default TravelPackagesUserPage;