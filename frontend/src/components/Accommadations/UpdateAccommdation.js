import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateAccommodation.css"; // 👈 unique CSS file
import AdminDashboard from "../AdminDashboard/admindash";

function UpdateAccommodation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/accommodation/${id}`
        );
        const data = res.data.accommodation || res.data;

        setFormData({
          accommodationId: data.accommodationId || "",
          accommodationName: data.accommodationName || "",
          type: data.type || "",
          description: data.description || "",
          location: data.location || "",
          address: data.address || "",
          phone: data.phone || "",
          roomType: Array.isArray(data.roomType)
            ? data.roomType.join(", ")
            : "",
          pricePerNight: data.pricePerNight || "",
          currency: data.currency || "",
          availability: data.availability ?? true,
          amenities: Array.isArray(data.amenities)
            ? data.amenities.join(", ")
            : "",
          checkInTime: data.checkInTime || "",
          checkOutTime: data.checkOutTime || "",
          images: Array.isArray(data.images) ? data.images : [""], // ✅ dynamic array
        });
      } catch (err) {
        console.error("Error fetching accommodation:", err);
      }
    };
    fetchAccommodation();
  }, [id]);

  if (!formData) return <p>Loading...</p>;

  // Handle text/checkbox changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle dynamic images
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

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        roomType: formData.roomType
          ? formData.roomType.split(",").map((s) => s.trim())
          : [],
        amenities: formData.amenities
          ? formData.amenities.split(",").map((s) => s.trim())
          : [],
        images: formData.images.filter((img) => img.trim() !== ""),
      };

      await axios.put(`http://localhost:5001/accommodation/${id}`, payload);
      alert("Accommodation updated successfully!");
      navigate("/accommodation");
    } catch (err) {
      console.error("Error updating accommodation:", err);
      alert("Update failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
     <div className="flex flex-col min-h-screen">
          <AdminDashboard>
        
            <main className="flex-grow">
    <div className="update-acc-page">
      <h1 className="update-acc-title">Update Accommodation</h1>
      <form onSubmit={handleSubmit} className="update-acc-form">
        <div className="update-acc-grid">
          <label>
            Name:
            <input
              name="accommodationName"
              value={formData.accommodationName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Type:
            <input
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Location:
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Address:
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Phone:
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Room Types:
            <input
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Price Per Night:
            <input
              type="number"
              name="pricePerNight"
              value={formData.pricePerNight}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Currency:
            <input
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              required
            />
          </label>
          <label className="update-acc-checkbox">
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
            />
            Available
          </label>
          <label>
            Amenities:
            <input
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Check-in Time:
            <input
              name="checkInTime"
              value={formData.checkInTime}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Check-out Time:
            <input
              name="checkOutTime"
              value={formData.checkOutTime}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        {/* ✅ Dynamic Images */}
        <div className="update-acc-images">
          <h3>Accommodation Images</h3>
          {formData.images.map((img, index) => (
            <div key={index} className="update-acc-image-field">
              <label>Image {index + 1}:</label>
              <input
                type="text"
                value={img}
                onChange={(e) => handleImageChange(index, e.target.value)}
              />
              {img && (
                <img
                  src={img}
                  alt={`Preview ${index + 1}`}
                  className="update-acc-preview"
                />
              )}
              <button
                type="button"
                className="btn-acc-remove"
                onClick={() => removeImageField(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-acc-add-image"
            onClick={addImageField}
          >
            + Add Another Image
          </button>
        </div>

        <button type="submit" className="btn-acc-submit">
          Update Accommodation
        </button>
      </form>
    </div>

    </main>
        </AdminDashboard>
        </div>  
  );
}

export default UpdateAccommodation;
