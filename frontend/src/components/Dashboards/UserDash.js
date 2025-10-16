import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserDashboard.css";
import Header from "../Header/header";
import Fotter from "../Fotter/fotter";


function UserDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", currentPassword: "", newPassword: "", phone: "", address: "" });
  const [isSettingsVisible, setSettingsVisible] = useState(false); // Track settings visibility
  const [isDeleting, setIsDeleting] = useState(false);

  const userId = "user-id"; // Replace with the authenticated user ID, ideally from context or state

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:5001/bookings");
        const data = await res.json();
        if (Array.isArray(data)) {
          setBookings(data);
        } else if (Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        } else {
          setBookings([]); // fallback
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    fetchBookings();
  }, []);

  // Profile update form handler
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        email: form.email,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        phone: form.phone,
        address: form.address,
      };

      const res = await axios.put(`http://localhost:5001/user/update-profile/${userId}`, payload);
      alert(res.data.msg);
      
      // Reset password fields
      setForm({ ...form, currentPassword: "", newPassword: "" });
      setSettingsVisible(false); // Close the settings after successful update
    } catch (err) {
      alert("Error updating profile");
    }
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        const res = await axios.delete(`http://localhost:5001/user/delete-account/${userId}`);
        alert(res.data.msg); // Account deleted
        // Optionally, redirect to login page or homepage
        navigate("/login");
      } catch (err) {
        alert("Error deleting account");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Stats calculations
  const totalBookings = bookings.length;
  const today = new Date();
  const upcomingTrips = bookings.filter((b) => new Date(b.startDate) > today).length;
  const savedPackages = 0; // keep 0 until you implement favorites
  const recentBookings = bookings.slice(0, 5);

  return (
    <div>
      <Header />
    <div className="user-dashboard-container">
      {/* Sidebar */}
      <aside className="user-dashboard-sidebar">
        <h2 className="user-dashboard-logo">Travel Aura</h2>
        <ul className="user-dashboard-menu">
          <li className="user-dashboard-menu-item">🏠 Dashboard</li>
          <li
            className="user-dashboard-menu-item active"
            onClick={() => navigate("/my-bookings")}
          >
            📦 My Bookings
          </li>
          <li className="user-dashboard-menu-item">🏨 Accommodations</li>
          <li className="user-dashboard-menu-item">✈ Travel Packages</li>
          <li
            className="user-dashboard-menu-item"
            onClick={() => setSettingsVisible(!isSettingsVisible)} // Toggle settings visibility
          >
            ⚙ Settings
          </li>
          <li className="user-dashboard-menu-item logout" 
            onClick={() => navigate("/login")}>🚪 Log Out
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="user-dashboard-main">
        <header className="user-dashboard-header">
          <h1>Welcome Back!</h1>
          <p>Your personalized dashboard overview</p>
        </header>

        {/* Stats Cards */}
        <section className="user-dashboard-cards">
          <div className="user-dashboard-card">
            <h3>Total Bookings</h3>
            <p>{totalBookings}</p>
          </div>
          <div className="user-dashboard-card">
            <h3>Upcoming Trips</h3>
            <p>{upcomingTrips}</p>
          </div>
          <div className="user-dashboard-card">
            <h3>Saved Packages</h3>
            <p>{savedPackages}</p>
          </div>
        </section>

        {/* Recent Bookings */}
        <section className="user-dashboard-content">
          <h2>Recent Bookings</h2>
          <table className="user-dashboard-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Package / Accommodation</th>
                <th>Date of Purchase</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking._id}</td>
                    <td>{booking.travelPackage ? "Travel Package" : "Accommodation"}</td>
                    <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                    <td className={`status ${booking.status?.toLowerCase() || "pending"}`}>
                      {booking.status || "Pending"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No bookings found</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Settings Section */}
        {isSettingsVisible && (
          <section className="user-dashboard-settings">
            <h2>Settings</h2>
            <div className="settings-container">
              {/* Profile Update Form */}
              <div className="profile-update-form">
                <h3>Update Profile</h3>
                <form onSubmit={handleProfileUpdate}>
                  <div>
                    <label>Username</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label>Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <h3>Change Password</h3>
                  <div>
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={form.currentPassword}
                      onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label>New Password</label>
                    <input
                      type="password"
                      value={form.newPassword}
                      onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                      required
                    />
                  </div>
                  <h3>Additional Details</h3>
                  <div>
                    <label>Phone</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Address</label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                  </div>
                  <button type="submit">Save Changes</button>
                </form>
              </div>

              {/* Delete Account Button */}
              <div className="delete-account-container">
                <button className="delete-account-btn" onClick={handleDeleteAccount}>
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
    <Fotter />
    </div>
  );
}

export default UserDashboard;
