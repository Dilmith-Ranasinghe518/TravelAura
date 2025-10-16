import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

function UserSidebar({ active }) {
  const navigate = useNavigate();

  return (
    <aside className="user-dashboard-sidebar">
      <h2 className="user-dashboard-logo">Travel Aura</h2>
      <ul className="user-dashboard-menu">
        <li
          className={`user-dashboard-menu-item ${
            active === "dashboard" ? "active" : ""
          }`}
          onClick={() => navigate("/user-dashboard")}
        >
          🏠 Dashboard
        </li>
        <li
          className={`user-dashboard-menu-item ${
            active === "bookings" ? "active" : ""
          }`}
          onClick={() => navigate("/my-bookings")}
        >
          📦 My Bookings
        </li>
        <li
          className={`user-dashboard-menu-item ${
            active === "accommodations" ? "active" : ""
          }`}
          onClick={() => navigate("/accommodations-user")}
        >
          🏨 Accommodations
        </li>
        <li
          className={`user-dashboard-menu-item ${
            active === "packages" ? "active" : ""
          }`}
          onClick={() => navigate("/travel-packages-user")}
        >
          ✈ Travel Packages
        </li>
        <li
          className={`user-dashboard-menu-item ${
            active === "settings" ? "active" : ""
          }`}
          onClick={() => navigate("/settings")}
        >
          ⚙ Settings
        </li>
        <li
          className="user-dashboard-menu-item logout"
          onClick={() => navigate("/logout")}
        >
          🚪 Logout
        </li>
      </ul>
    </aside>
  );
}

export default UserSidebar;
