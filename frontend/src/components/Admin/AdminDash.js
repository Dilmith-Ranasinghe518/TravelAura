// AdminDashboard.jsx
import React, { useState } from "react";
import AdminSidebar from "../Admin/AdminSidebar";
import TravelPackagePage from "../Travelpackages/Travelpackages";
import UserManagement from "../Admin/UserManagement";
import BookingManagement from "../Admin/BookingManagement";
import DashboardOverview from "../Admin/DashboardOverview";
import AccommodationPage from "../Accommadations/Accommadationpage";
import './TravelPackagePage.css';

function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardOverview />;
      case "packages":
        return <TravelPackagePage />;
      case "bookings":
        return <BookingManagement />;
      case "users":
        return <UserManagement />;
      case "reports":
        return <div className="admin-content-section"><h2>Reports</h2><p>Reports functionality coming soon...</p></div>;
      case "settings":
        return <div className="admin-content-section"><h2>Settings</h2><p>Settings functionality coming soon...</p></div>;
        case "accommodations":
        // return <div className="admin-content-section"><h2>Accommodation</h2><p>Accommodation functionality coming soon...</p></div>;
        return <AccommodationPage />;
      default:
        return <DashboardOverview />;
    }
  };

  const handleLogout = () => {
    // Implement logout logic
    localStorage.removeItem("adminToken");
    window.location.href = "/";
  };

  return (
    <div className="admin-container">
      <AdminSidebar 
        activePage={activePage} 
        setActivePage={setActivePage}
        onLogout={handleLogout}
      />
      
      <div className="admin-main-content">
        <div className="content-header">
          <h1>
            {activePage === "dashboard" && "Dashboard Overview"}
            {activePage === "packages" && "Travel Packages Management"}
            {activePage === "bookings" && "Booking Management"}
            {activePage === "users" && "User Management"}
            {activePage === "reports" && "Reports"}
            {activePage === "settings" && "Settings"}
          </h1>
        </div>

        {renderActivePage()}
      </div>
    </div>
  );
}

export default AdminDashboard;