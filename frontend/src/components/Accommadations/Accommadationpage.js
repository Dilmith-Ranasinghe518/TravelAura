import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import Nav from "../Nav/Navbar";
import "./AccommodationPage.css";
import AdminDashboard from "../AdminDashboard/admindash";


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
      <img
        src="https://placehold.co/300x200?text=No+Image"
        alt="No accommodation"
        style={{
          width: "300px",
          height: "200px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        marginBottom: "15px",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={() =>
            setIndex((i) => (i === 0 ? images.length - 1 : i - 1))
          }
        >
          ◀
        </button>
        <img
          src={images[index]}
          alt={`${name} ${index + 1}`}
          style={{
            width: "300px",
            height: "200px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/300x200?text=Image+Error";
          }}
        />
        <button
          onClick={() =>
            setIndex((i) => (i === images.length - 1 ? 0 : i + 1))
          }
        >
          ▶
        </button>
      </div>

      {/* dots */}
      <div style={{ display: "flex", gap: "6px", marginTop: "5px" }}>
        {images.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              cursor: "pointer",
              background: i === index ? "#2563eb" : "#d1d5db",
            }}
          ></span>
        ))}
      </div>
    </div>
  );
}

function Accommodationpage() {
  const [accommodations, setAccommodations] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterAvailability, setFilterAvailability] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const navigate = useNavigate();

  const sriLankaCities = [
    "All",
    "Colombo",
    "Kandy",
    "Galle",
    "Jaffna",
    "Negombo",
    "Trincomalee",
    "Anuradhapura",
    "Nuwara Eliya",
    "Matara",
    "Kurunegala",
    "Batticaloa",
    "Ratnapura",
    "Hambantota",
  ];

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch("http://localhost:5001/accommodation");
        const data = await response.json();
        setAccommodations(data.accommodations || []);
      } catch (err) {
        console.error("Error fetching accommodations:", err);
      }
    };
    fetchAccommodations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this accommodation?"))
      return;

    try {
      const res = await fetch(`http://localhost:5001/accommodation/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Accommodation deleted successfully");
        setAccommodations((prev) => prev.filter((acc) => acc._id !== id));
      } else {
        alert("Failed to delete accommodation");
      }
    } catch (err) {
      console.error("Error deleting accommodation:", err);
    }
  };

  // ✅ Filtering
  const filteredAccommodations = accommodations.filter((acc) => {
    const matchesSearch =
      acc.accommodationName.toLowerCase().includes(search.toLowerCase()) ||
      acc.description.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      filterType === "All" || acc.type.toLowerCase() === filterType.toLowerCase();

    const matchesAvailability =
      filterAvailability === "All" ||
      (filterAvailability === "Available" && acc.availability) ||
      (filterAvailability === "Not Available" && !acc.availability);

    const matchesLocation =
      filterLocation === "All" ||
      acc.location.toLowerCase() === filterLocation.toLowerCase();

    const matchesPrice =
      acc.pricePerNight >= priceRange[0] &&
      acc.pricePerNight <= priceRange[1];

    return (
      matchesSearch &&
      matchesType &&
      matchesAvailability &&
      matchesLocation &&
      matchesPrice
    );
  });

  return (


        <div className="flex flex-col min-h-screen">
                  <AdminDashboard>
                <main className="flex-grow">

    <div className="accommodation-page">
      {/* <Nav /> */}
      <h1 className="accommodation-title">Accommodations</h1>

      {/* ✅ Filters */}
      <div className="accommodation-filters">
        <input
          type="text"
          placeholder="Search by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Hotel">Hotel</option>
          <option value="Villa">Villa</option>
          <option value="Resort">Resort</option>
          <option value="Apartment">Apartment</option>
          <option value="Hostel">Hostel</option>
        </select>

        <select
          value={filterAvailability}
          onChange={(e) => setFilterAvailability(e.target.value)}
        >
          <option value="All">All Availability</option>
          <option value="Available">Available</option>
          <option value="Not Available">Not Available</option>
        </select>

        <select
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
        >
          {sriLankaCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        {/* Price Range */}
        <div className="price-filter">
          <label>
            Price Range: Rs.{priceRange[0]} - Rs.{priceRange[1]}
          </label>
          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
          />
          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
          />
        </div>
      </div>

      {/* ✅ List */}
      <div className="accommodation-list">
        {filteredAccommodations.length > 0 ? (
          filteredAccommodations.map((acc) => (
            <div key={acc._id} className="accommodation-card">
              <ImageSlider images={acc.images} name={acc.accommodationName} />

              <div className="accommodation-info">
                <h2>{acc.accommodationName}</h2>
                <p>
                  <strong>ID:</strong> {acc.accommodationId}
                </p>
                <p>
                  <strong>Type:</strong> {acc.type}
                </p>
                <p>
                  <strong>Description:</strong> {acc.description}
                </p>
                <p>
                  <strong>Location:</strong> {acc.location}
                </p>
                <p>
                  <strong>Price:</strong> Rs.{acc.pricePerNight} {acc.currency}
                </p>
                <p
                  className={
                    acc.availability
                      ? "accommodation-available"
                      : "accommodation-not-available"
                  }
                >
                  {acc.availability ? "Available" : "Not Available"}
                </p>

                <div className="accommodation-actions">
                  <button
                    className="btn-update"
                    onClick={() => navigate(`/accommodationsupdate/${acc._id}`)}
                  >
                    Update
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(acc._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No accommodations found.</p>
        )}
      </div>
    </div>
    </main>
    </AdminDashboard>
    </div>
  );
}

export default Accommodationpage;
