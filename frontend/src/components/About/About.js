// src/components/About.jsx
import React from "react";
import Header from "../Header/header";
import Footer from "../Fotter/fotter";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow py-12 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-6">
            About <span className="text-amber-600">TravelAura</span>
          </h1>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            At TravelAura, we believe travel is more than just visiting places — it's about creating unforgettable memories, connecting with cultures, and exploring new adventures.
          </p>

          {/* Mission / Vision */}
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-sky-50 p-8 rounded-xl shadow-md border border-sky-100">
              <h2 className="text-2xl font-bold text-teal-600 mb-3">🌍 Our Mission</h2>
              <p className="text-gray-600">
                To make travel planning effortless and enjoyable, providing travelers with trusted destinations, accommodations, and experiences that match their passions.
              </p>
            </div>

            <div className="bg-amber-50 p-8 rounded-xl shadow-md border border-amber-100">
              <h2 className="text-2xl font-bold text-amber-600 mb-3">✨ Our Vision</h2>
              <p className="text-gray-600">
                To be the go-to platform for global travelers who seek authentic, safe, and unforgettable journeys across Sri Lanka and beyond.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-sky-600 mb-2">Trust</h3>
                <p className="text-gray-600">
                  We prioritize reliability, ensuring every booking and recommendation is secure and accurate.
                </p>
              </div>
              <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-teal-600 mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We embrace technology to deliver seamless travel planning tools and unique user experiences.
                </p>
              </div>
              <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-amber-600 mb-2">Community</h3>
                <p className="text-gray-600">
                  We build a strong global travel community by connecting explorers, storytellers, and culture lovers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
