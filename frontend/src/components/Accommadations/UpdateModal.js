import React, { useState, useEffect } from 'react';

function UpdateModal({ isOpen, onClose, accommodation, onUpdate }) {
  const [updatedData, setUpdatedData] = useState({ ...accommodation });

  useEffect(() => {
    setUpdatedData({ ...accommodation });
  }, [accommodation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({
      ...updatedData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5001/accommodation/${accommodation._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      if (data.accommodation) {
        onUpdate();
        onClose(); // Close the modal after update
      }
    } catch (err) {
      console.error('Error updating accommodation:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update Accommodation</h2>
        <form onSubmit={handleSubmit}>
          <label>Accommodation Name:</label>
          <input
            type="text"
            name="accommodationName"
            value={updatedData.accommodationName}
            onChange={handleChange}
          />
          <label>Price Per Night:</label>
          <input
            type="number"
            name="pricePerNight"
            value={updatedData.pricePerNight}
            onChange={handleChange}
          />
          <button type="submit">Update</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default UpdateModal;
