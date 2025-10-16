// src/components/Contact.jsx
import React from "react";
import Header from "../Header/header";
import Footer from "../Fotter/fotter";

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-sky-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow py-12 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-sky-100 p-8">
          {/* Header */}
          <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-4">
            Contact <span className="text-sky-600">TravelAura</span>
          </h1>
          <p className="text-gray-600 text-center mb-8">
            We’d love to hear from you! Whether you have a question, feedback, or just want to say hello.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Form */}
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Message</label>
                <textarea
                  rows="5"
                  placeholder="Write your message here..."
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-600 transition"
              >
                Send Message
              </button>
            </form>

            {/* Contact Info */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">📍 Our Office</h2>
                <p className="text-gray-600">123 Ocean Drive, Colombo, Sri Lanka</p>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">📞 Call Us</h2>
                <p className="text-gray-600">+94 77 123 4567</p>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">✉️ Email Us</h2>
                <p className="text-gray-600">support@travelaura.com</p>
              </div>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-sky-600 hover:text-sky-800 text-xl">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="text-sky-600 hover:text-sky-800 text-xl">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-sky-600 hover:text-sky-800 text-xl">
                  <i className="fab fa-twitter"></i>
                </a>
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
