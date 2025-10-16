import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateTravelPackage.css";
import AdminDashboard from "../AdminDashboard/admindash";


function UpdateTravelPackage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  // ✅ Fetch single package by ID
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/travelpackage/${id}`);
        const data = res.data.travelPackage;

        if (!data) return;

        setFormData({
          packageName: data.packageName ?? "",
          packageDescription: data.packageDescription ?? "",
          packageType: data.packageType ?? "",
          destinations: Array.isArray(data.destinations)
            ? data.destinations.join(", ")
            : "",
          duration: data.duration ?? "",
          startDate: data.startDate ? data.startDate.slice(0, 10) : "",
          endDate: data.endDate ? data.endDate.slice(0, 10) : "",
          itinerary: Array.isArray(data.itinerary)
            ? data.itinerary.join(", ")
            : "",
          inclusions: Array.isArray(data.inclusions)
            ? data.inclusions.join(", ")
            : "",
          exclusions: Array.isArray(data.exclusions)
            ? data.exclusions.join(", ")
            : "",
          availability: data.availability ?? true,
          currency: data.currency ?? "",
          price: data.price ?? "",
          transportType: data.transportType ?? "",
          travelImages: Array.isArray(data.travelImages)
            ? data.travelImages
            : [""],
        });
      } catch (err) {
        console.error("Error fetching package:", err);
      }
    };
    fetchPackage();
  }, [id]);

  if (!formData) return <p>Loading...</p>;

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Handle dynamic images
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

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        destinations: formData.destinations
          ? formData.destinations.split(",").map((s) => s.trim())
          : [],
        itinerary: formData.itinerary
          ? formData.itinerary.split(",").map((s) => s.trim())
          : [],
        inclusions: formData.inclusions
          ? formData.inclusions.split(",").map((s) => s.trim())
          : [],
        exclusions: formData.exclusions
          ? formData.exclusions.split(",").map((s) => s.trim())
          : [],
        travelImages: formData.travelImages.filter((url) => url.trim() !== ""),
      };

      await axios.put(`http://localhost:5001/travelpackage/${id}`, payload);

      alert("✅ Package updated successfully!");
      navigate("/travelpackages");
    } catch (err) {
      console.error("Error updating package:", err);
      alert("Update failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
     <div className="flex flex-col min-h-screen">
              <AdminDashboard>
            
                <main className="flex-grow">
    <div className="update-travel-page">
      <h1 className="update-travel-title">✏️ Update Travel Package</h1>
      <form className="update-travel-form" onSubmit={handleSubmit}>
        <div className="update-travel-grid">
          <label>
            Package Name:
            <input
              name="packageName"
              value={formData.packageName}
              onChange={handleChange}
              placeholder="Package Name"
              required
            />
          </label>
          <label>
            Package Description:
            <textarea
              name="packageDescription"
              value={formData.packageDescription}
              onChange={handleChange}
              placeholder="Description"
              required
            />
          </label>
          <label>
            Package Type:
            <input
              name="packageType"
              value={formData.packageType}
              onChange={handleChange}
              placeholder="Package Type"
              required
            />
          </label>
          <label>
            Destinations:
            <input
              name="destinations"
              value={formData.destinations}
              onChange={handleChange}
              placeholder="Destinations (comma separated)"
              required
            />
          </label>
          <label>
            Duration:
            <input
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Duration"
              required
            />
          </label>
          <label>
            Start Date:
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Itinerary:
            <input
              name="itinerary"
              value={formData.itinerary}
              onChange={handleChange}
              placeholder="Itinerary (comma separated)"
              required
            />
          </label>
          <label>
            Inclusions:
            <input
              name="inclusions"
              value={formData.inclusions}
              onChange={handleChange}
              placeholder="Inclusions (comma separated)"
              required
            />
          </label>
          <label>
            Exclusions:
            <input
              name="exclusions"
              value={formData.exclusions}
              onChange={handleChange}
              placeholder="Exclusions (comma separated)"
              required
            />
          </label>
          <label className="update-travel-checkbox">
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
            />
            Available
          </label>
          <label>
            Currency:
            <input
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              placeholder="Currency"
              required
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              required
            />
          </label>
          <label>
            Transport Type:
            <input
              name="transportType"
              value={formData.transportType}
              onChange={handleChange}
              placeholder="Transport Type"
              required
            />
          </label>
        </div>

        {/* ✅ Dynamic Travel Images */}
        <div className="update-travel-images">
          <h3>Travel Images</h3>
          {formData.travelImages.map((img, index) => (
            <div key={index} className="update-travel-image-field">
              <label>
                Image {index + 1}:
                <input
                  type="text"
                  value={img}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder={`Image URL ${index + 1}`}
                />
              </label>
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
                  className="update-travel-preview"
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
          Update Package
        </button>
      </form>
    </div>

        </main>
            </AdminDashboard>
            </div>  
  );
}

export default UpdateTravelPackage;
