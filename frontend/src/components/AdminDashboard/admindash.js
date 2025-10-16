// src/components/AdminDashboard/admindash.jsx
import React from "react";
import { Link } from "react-router-dom";

function NavItem({ to, iconClass, label }) {
  return (
    <Link
      to={to}
      className="nav-item"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.65rem 0.9rem",
        borderRadius: "0.6rem",
        fontWeight: 500,
        color: "#1F2937",
        textDecoration: "none",
        border: "1px solid transparent",
        transition: "all .2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#90CDF4";
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,.1)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "";
        e.currentTarget.style.boxShadow = "";
        e.currentTarget.style.transform = "";
      }}
    >
      <i
        className={iconClass}
        style={{ fontSize: 18, color: "#2B6CB0", width: 24, textAlign: "center" }}
      />
      <span>{label}</span>
    </Link>
  );
}

function Section({ title, children }) {
  return (
    <li style={{ marginBottom: "1rem" }}>
      <div
        className="nav-item nav-item--active"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          padding: "0.6rem 0.9rem",
          borderRadius: "0.6rem",
          fontWeight: 600,
          backgroundColor: "#C6F6D5",
          color: "#065F46",
          border: "1px solid #A7F3D0",
          marginBottom: "0.5rem",
        }}
      >
        <i
          className="fas fa-folder-open"
          style={{ fontSize: 18, color: "#059669", width: 24, textAlign: "center" }}
        />
        <span>{title}</span>
      </div>
      <div style={{ display: "grid", gap: "0.4rem" }}>{children}</div>
    </li>
  );
}

export default function AdminDashboard({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className="admin-sidebar"
        style={{
          width: 250,
          backgroundColor: "#BEE3F8",
          color: "#1F2937",
          height: "100vh",
          padding: "1.5rem 1rem",
          boxShadow: "4px 0px 8px rgba(0,0,0,0.1)",
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          zIndex: 10,
        }}
      >
        {/* Logo/Header Area */}
        <div
          style={{
            padding: "0.5rem 1rem",
            marginBottom: "1.25rem",
            borderBottom: "2px solid #90CDF4",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#2B6CB0",
              margin: 0,
            }}
          >
            Admin Panel
          </h2>
        </div>

        <nav style={{ flex: 1, overflowY: "auto" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            

            {/* === Sections === */}
            <Section title="Destinations">
              <NavItem
                to="/adddestination"
                iconClass="fas fa-plus-circle"
                label="Add Destination"
              />
              <NavItem
                to="/destinationview"
                iconClass="fas fa-map-marked-alt"
                label="View Destinations"
              />
            </Section>

            <Section title="Travel Tours">
              <NavItem
                to="/inserttravelpackage"
                iconClass="fas fa-plus-circle"
                label="Add Tour"
              />
              <NavItem
                to="/travelpackages"
                iconClass="fas fa-route"
                label="View Tours"
              />
            </Section>

<Section title="Accommodations Management">
              <NavItem
                to="/insertaccommodation"
                iconClass="fas fa-plus-circle"
                label="Add Accommodation"
              />
              <NavItem
                to="/accommodation"
                iconClass="far fa-calendar-alt"
                label="View Accommodations"
              />
            </Section>


            <Section title="Blogs & Reviews">
              <NavItem
                to="/addblog"
                iconClass="fas fa-plus-circle"
                label="Add Blog"
              />
              <NavItem
                to="/view"
                iconClass="far fa-newspaper"
                label="View Blogs"
              />
            </Section>

            <Section title="Events & Festivals">
              <NavItem
                to="/admin/events"
                iconClass="fas fa-plus-circle"
                label="Add Event/Festival"
              />
              <NavItem
                to="/events"
                iconClass="far fa-calendar-alt"
                label="View Events/Festivals"
              />

               <NavItem
                to="/mainhome"
                iconClass="far fa-calendar-alt"
                label="Back to home"
              />


            </Section>

            {/* (Optional) Legacy links if you still use these exact routes */}
            {/* 
            <Section title="Legacy">
              <NavItem to="/adddestination" iconClass="fas fa-plus-circle" label="Add Destination (old)" />
              <NavItem to="/destinationview" iconClass="fas fa-map-marked-alt" label="Destination View (old)" />
            </Section>
            */}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div
          style={{
            padding: "1rem",
            marginTop: "auto",
            borderTop: "2px solid #90CDF4",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "#4A5568",
          }}
        >
          <p style={{ margin: 0 }}>Admin Dashboard v1.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          marginLeft: 250,
          padding: "2rem",
          width: "calc(100% - 250px)",
          minHeight: "100vh",
          backgroundColor: "#F7FAFC",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        {/* Removed the “Welcome to Admin Dashboard” header box */}

        {/* Content container (kept as in your original) */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.5rem",
            padding: "2rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
