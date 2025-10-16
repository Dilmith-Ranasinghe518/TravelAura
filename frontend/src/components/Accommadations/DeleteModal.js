import React from 'react';

function DeleteModal({ isOpen, onClose, onDelete, accommodationId }) {
  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5001/accommodation/${accommodationId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.accommodation) {
        onDelete(); // Remove deleted accommodation from list
        onClose(); // Close the modal after delete
      }
    } catch (err) {
      console.error('Error deleting accommodation:', err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Are you sure you want to delete this accommodation?</h2>
        <button onClick={handleDelete}>Yes, Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default DeleteModal;
