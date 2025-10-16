// DashboardOverview.jsx
import React, { useState, useEffect } from "react";

function DashboardOverview() {
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalBookings: 0,
    totalUsers: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // In a real application, you would fetch these from your API
      const packagesResponse = await fetch("http://localhost:5001/travelpackage");
      const bookingsResponse = await fetch("http://localhost:5001/bookings");
      const usersResponse = await fetch("http://localhost:5001/users");

      const packagesData = await packagesResponse.json();
      const bookingsData = await bookingsResponse.json();
      const usersData = await usersResponse.json();

      // Calculate revenue from confirmed and completed bookings
      const revenue = bookingsData.bookings
        .filter(b => b.status === "confirmed" || b.status === "completed")
        .reduce((sum, booking) => sum + booking.totalPrice, 0);

      setStats({
        totalPackages: packagesData.packages?.length || 0,
        totalBookings: bookingsData.bookings?.length || 0,
        totalUsers: usersData.users?.length || 0,
        revenue: revenue
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
  };

  return (
    <div className="dashboard-overview">
      <div className="admin-stats-container">
        <div className="stat-card">
          <div className="stat-icon total">📦</div>
          <div className="stat-info">
            <h3>{stats.totalPackages}</h3>
            <p>Total Packages</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bookings">📝</div>
          <div className="stat-info">
            <h3>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon users">👥</div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon revenue">💰</div>
          <div className="stat-info">
            <h3>Rs. {stats.revenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h3>Recent Activities</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">✅</span>
              <div className="activity-content">
                <p>New booking received for "Beach Paradise Package"</p>
                <span className="activity-time">2 minutes ago</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">👤</span>
              <div className="activity-content">
                <p>New user registered: john@example.com</p>
                <span className="activity-time">15 minutes ago</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">✈️</span>
              <div className="activity-content">
                <p>New travel package "Mountain Adventure" was added</p>
                <span className="activity-time">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button className="quick-action-btn">
              <span className="action-icon">➕</span>
              <span>Add New Package</span>
            </button>
            <button className="quick-action-btn">
              <span className="action-icon">👥</span>
              <span>View Users</span>
            </button>
            <button className="quick-action-btn">
              <span className="action-icon">📊</span>
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;