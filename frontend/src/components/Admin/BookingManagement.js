// BookingManagement.jsx
import React, { useState, useEffect } from "react";

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.packageName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }
    
    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, bookings]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5001/bookings");
      const data = await response.json();
      if (data.bookings) {
        setBookings(data.bookings);
        setFilteredBookings(data.bookings);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      alert("Failed to fetch bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert("Booking status updated successfully");
        // Update local state
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        ));
      } else {
        alert("Failed to update booking status");
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
      alert("Failed to update booking status");
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`http://localhost:5001/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Booking deleted successfully");
        fetchBookings(); // Refresh the booking list
      } else {
        alert("Failed to delete booking");
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking");
    }
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="admin-content-section">
      <div className="section-header">
        <h2>Booking Management</h2>
        <p>Manage all bookings made by users</p>
      </div>

      <div className="admin-filters-panel">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Search Bookings</label>
            <input
              type="text"
              placeholder="Search by user, package, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
          </div>

          <div className="filter-group">
            <label>Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-select"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>User</th>
              <th>Package</th>
              <th>Booking Date</th>
              <th>Travel Date</th>
              <th>Guests</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="booking-id">{booking._id.slice(-6)}</td>
                  <td>
                    <div className="user-info">
                      <div className="user-name">{booking.userName}</div>
                      <div className="user-email">{booking.userEmail}</div>
                    </div>
                  </td>
                  <td className="package-name">{booking.packageName}</td>
                  <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td>{new Date(booking.travelDate).toLocaleDateString()}</td>
                  <td>{booking.guests}</td>
                  <td className="price">Rs. {booking.totalPrice.toLocaleString()}</td>
                  <td>
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className={`status-select ${booking.status}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(booking._id)}
                      className="btn-action btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingManagement;