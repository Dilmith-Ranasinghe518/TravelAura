import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "./InsertTravelPackage.css"; // 👈 Import unique CSS file
import AdminDashboard from "../AdminDashboard/admindash";


function InsertTravelPackage() {
  const [formData, setFormData] = useState({
    packageId: "",
    packageName: "",
    packageDescription: "",
    packageType: "",
    destinations: "",
    duration: "",
    startDate: "",
    endDate: "",
    itinerary: "",
    inclusions: "",
    exclusions: "",
    availability: true,
    currency: "",
    price: "",
    transportType: "",
    travelImages: [""], // ✅ multiple image fields
  });

  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ handle multiple images
  const handleImageChange = (index, value) => {
    const updated = [...formData.travelImages];
    updated[index] = value;
    setFormData({ ...formData, travelImages: updated });
  };

  const addImageField = () => {
    setFormData({ ...formData, travelImages: [...formData.travelImages, ""] });
  };

  const removeImageField = (index) => {
    const updated = formData.travelImages.filter((_, i) => i !== index);
    setFormData({ ...formData, travelImages: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        destinations: formData.destinations.split(",").map((s) => s.trim()),
        itinerary: formData.itinerary.split(",").map((s) => s.trim()),
        inclusions: formData.inclusions.split(",").map((s) => s.trim()),
        exclusions: formData.exclusions.split(",").map((s) => s.trim()),
        travelImages: formData.travelImages.filter((url) => url.trim() !== ""),
      };

      await axios.post("http://localhost:5001/travelpackage", payload);

      alert("✅ Travel Package added successfully!");

      setFormData({
        packageId: "",
        packageName: "",
        packageDescription: "",
        packageType: "",
        destinations: "",
        duration: "",
        startDate: "",
        endDate: "",
        itinerary: "",
        inclusions: "",
        exclusions: "",
        availability: true,
        currency: "",
        price: "",
        transportType: "",
        travelImages: [""],
      }) 
      navigate("/admindash");
    } catch (err) {
      console.error("Insert error:", err);
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (

    <div className="flex flex-col min-h-screen">
              <AdminDashboard>
            <main className="flex-grow">


    <div className="insert-travel-page">
      <h1 className="insert-travel-title">➕ Add New Travel Package</h1>
      <form className="insert-travel-form" onSubmit={handleSubmit}>
        <div className="insert-travel-grid">
          <input
            name="packageId"
            placeholder="Package ID"
            value={formData.packageId}
            onChange={handleChange}
            required
          />
          <input
            name="packageName"
            placeholder="Package Name"
            value={formData.packageName}
            onChange={handleChange}
            required
          />
          <textarea
            name="packageDescription"
            placeholder="Package Description"
            value={formData.packageDescription}
            onChange={handleChange}
            required
          />
          <input
            name="packageType"
            placeholder="Package Type"
            value={formData.packageType}
            onChange={handleChange}
            required
          />
          <input
            name="destinations"
            placeholder="Destinations (comma separated)"
            value={formData.destinations}
            onChange={handleChange}
            required
          />
          <input
            name="duration"
            placeholder="Duration (e.g. 5 Days 4 Nights)"
            value={formData.duration}
            onChange={handleChange}
            required
          />
          <label className="insert-travel-label">
            Start Date:
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </label>
          <label className="insert-travel-label">
            End Date:
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </label>
          <input
            name="itinerary"
            placeholder="Itinerary (comma separated)"
            value={formData.itinerary}
            onChange={handleChange}
            required
          />
          <input
            name="inclusions"
            placeholder="Inclusions (comma separated)"
            value={formData.inclusions}
            onChange={handleChange}
            required
          />
          <input
            name="exclusions"
            placeholder="Exclusions (comma separated)"
            value={formData.exclusions}
            onChange={handleChange}
            required
          />
          <label className="insert-travel-checkbox">
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
            />
            Available
          </label>
          <input
            name="currency"
            placeholder="Currency"
            value={formData.currency}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input
            name="transportType"
            placeholder="Transport Type (Bus, Flight, Train)"
            value={formData.transportType}
            onChange={handleChange}
            required
          />
        </div>

        {/* ✅ Dynamic Travel Images */}
        <div className="insert-travel-images">
          <h3>Travel Images</h3>
          {formData.travelImages.map((img, index) => (
            <div key={index} className="insert-travel-image-field">
              <input
                type="text"
                placeholder={`Image URL ${index + 1}`}
                value={img}
                onChange={(e) => handleImageChange(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeImageField(index)}
                disabled={formData.travelImages.length === 1}
                className="btn-remove"
              >
                Remove
              </button>
              {img && (
                <img
                  src={img}
                  alt={`Preview ${index + 1}`}
                  className="insert-travel-preview"
                />
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="btn-add-image"
          >
            + Add Another Image
          </button>
        </div>

        <button type="submit" className="btn-submit">
          Add Travel Package
        </button>
      </form>
    </div>
    </main>
    </AdminDashboard>
    </div>
  );
}

export default InsertTravelPackage;
