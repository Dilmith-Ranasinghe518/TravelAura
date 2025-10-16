import React, { useState, useEffect } from "react";
import Header from "../Header/header";
import Footer from "../Fotter/fotter";

function ColomboDetails() {
  // Image slider setup
  const images = [
    "https://i.pinimg.com/736x/59/f7/ce/59f7ce96297ceb4903fbc6535557c6c4.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/1/11/Colombo_skyline_2024.jpg",
    "https://i.pinimg.com/1200x/d2/60/99/d26099bbf6c53a430234f40e4a5a3fc9.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-change every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="bg-white min-h-screen text-gray-800 flex flex-col">
      {/* Header */}
      <Header />

      {/* Hero Slider */}
      <div className="relative w-full h-[400px] overflow-hidden">
        <img
          src={images[currentIndex]}
          alt="Colombo Skyline"
          className="w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Explore Colombo
          </h1>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-4 w-full flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`h-3 w-3 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-gray-400"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto p-6 md:p-12 flex-1">
        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">About Colombo</h2>
          <p className="text-lg leading-relaxed">
            Colombo, the bustling capital of Sri Lanka, is a blend of modern city life and
            colonial charm. Known for its lively markets, historic sites, vibrant nightlife,
            and oceanfront views, Colombo is the gateway to exploring the island while offering
            plenty of its own unique attractions.
          </p>
        </section>

        {/* Activities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Things To Do in Colombo</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Take a sunset stroll at <strong>Galle Face Green</strong></li>
            <li>Shop and dine at <strong>Colombo City Centre</strong> & <strong>One Galle Face Mall</strong></li>
            <li>Enjoy Sri Lankan street food and seafood by the beach</li>
            <li>Take a tuk-tuk ride through the busy streets</li>
            <li>Visit cultural landmarks and temples for a spiritual experience</li>
            <li>Explore nightlife spots and rooftop bars with city views</li>
          </ul>
        </section>

        {/* Best Places */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Best Places to Visit</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-4 border rounded-lg shadow">
              <h3 className="font-semibold text-xl mb-2">Gangaramaya Temple</h3>
              <p>
                A famous Buddhist temple with a unique mix of modern architecture and cultural essence.
              </p>
            </div>
            <div className="p-4 border rounded-lg shadow">
              <h3 className="font-semibold text-xl mb-2">National Museum of Colombo</h3>
              <p>
                The largest museum in Sri Lanka showcasing history, art, and artifacts from the island’s heritage.
              </p>
            </div>
            <div className="p-4 border rounded-lg shadow">
              <h3 className="font-semibold text-xl mb-2">Independence Square</h3>
              <p>
                A landmark of Sri Lanka’s independence with colonial-style architecture and a peaceful park.
              </p>
            </div>
            <div className="p-4 border rounded-lg shadow">
              <h3 className="font-semibold text-xl mb-2">Old Dutch Hospital</h3>
              <p>
                A restored colonial building now home to upscale cafes, shops, and restaurants.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ColomboDetails;
