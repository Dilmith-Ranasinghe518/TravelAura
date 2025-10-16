import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "./InsertAccommodation.css"; // 👈 Import unique CSS
import AdminDashboard from "../AdminDashboard/admindash";


function InsertAccommodation() {
  const [formData, setFormData] = useState({
    accommodationId: "",
    accommodationName: "",
    type: "",
    description: "",
    location: "",
    address: "",
    phone: "",
    roomType: "",
    pricePerNight: "",
    currency: "",
    availability: true,
    amenities: "",
    checkInTime: "",
    checkOutTime: "",
    images: [""],
  });

  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const removeImageField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        roomType: formData.roomType.split(",").map((s) => s.trim()),
        amenities: formData.amenities.split(",").map((s) => s.trim()),
        images: formData.images.filter((url) => url.trim() !== ""),
      };

      await axios.post("http://localhost:5001/accommodation", payload);

      alert("Accommodation added successfully!");

      setFormData({
        accommodationId: "",
        accommodationName: "",
        type: "",
        description: "",
        location: "",
        address: "",
        phone: "",
        roomType: "",
        pricePerNight: "",
        currency: "",
        availability: true,
        amenities: "",
        checkInTime: "",
        checkOutTime: "",
        images: [""],
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
    <div className="insert-accommodation-page">
      <h1 className="insert-accommodation-title">➕ Add New Accommodation</h1>
      <form className="insert-accommodation-form" onSubmit={handleSubmit}>
        <div className="insert-accommodation-grid">
          <input
            name="accommodationId"
            placeholder="Accommodation ID"
            value={formData.accommodationId}
            onChange={handleChange}
            required
          />
          <input
            name="accommodationName"
            placeholder="Accommodation Name"
            value={formData.accommodationName}
            onChange={handleChange}
            required
          />
          <input
            name="type"
            placeholder="Type (Hotel, Villa...)"
            value={formData.type}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            name="roomType"
            placeholder="Room Types (comma separated)"
            value={formData.roomType}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="pricePerNight"
            placeholder="Price per Night"
            value={formData.pricePerNight}
            onChange={handleChange}
            required
          />
          <input
            name="currency"
            placeholder="Currency"
            value={formData.currency}
            onChange={handleChange}
            required
          />
          <label className="insert-accommodation-checkbox">
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
            />
            Available
          </label>
          <input
            name="amenities"
            placeholder="Amenities (comma separated)"
            value={formData.amenities}
            onChange={handleChange}
            required
          />
          <input
            name="checkInTime"
            placeholder="Check-in Time (e.g. 14:00)"
            value={formData.checkInTime}
            onChange={handleChange}
            required
          />
          <input
            name="checkOutTime"
            placeholder="Check-out Time (e.g. 11:00)"
            value={formData.checkOutTime}
            onChange={handleChange}
            required
          />
        </div>

        {/* ✅ Dynamic Image Fields */}
        <div className="insert-accommodation-images">
          <h3>Images</h3>
          {formData.images.map((img, index) => (
            <div key={index} className="insert-accommodation-image-field">
              <input
                type="text"
                placeholder={`Image URL ${index + 1}`}
                value={img}
                onChange={(e) => handleImageChange(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeImageField(index)}
                disabled={formData.images.length === 1}
                className="btn-remove"
              >
                Remove
              </button>

              {img && (
                <div>
                  <img
                    src={img}
                    alt={`Preview ${index + 1}`}
                    className="insert-accommodation-preview"
                  />
                </div>
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
          Add Accommodation
        </button>
      </form>
    </div>
    </main>
    </AdminDashboard>
    </div>
    
  );
}

export default InsertAccommodation;
