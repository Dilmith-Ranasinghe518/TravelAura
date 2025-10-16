// src/components/Booking/BookingFormPage.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingFormPage.css";
import Header from "../Header/header";
import Fotter from "../Fotter/fotter";


function BookingFormPage() {
  const { state } = useLocation(); // accommodation data
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    qty: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const totalPrice = state.pricePerNight * formData.qty;
    navigate("/payment", { state: { ...formData, accommodation: state, totalPrice } });
  };

  return (
    <div>
      <Header />
    <div className="booking-form-page">
     
      <h1 className="booking-form-title">Booking Form</h1>
      <form onSubmit={handleSubmit} className="booking-form-container">
        <label>
          Name:
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Quantity:
          <input
            type="number"
            name="qty"
            min="1"
            value={formData.qty}
            onChange={handleChange}
            required
          />
        </label>

        <p className="booking-form-price">
          Total Price: Rs.{state.pricePerNight * formData.qty}
        </p>

        <button type="submit" className="btn-booking-next">Proceed to Payment</button>
      </form>
      </div>
      <Fotter />
    </div>

  );
}

export default BookingFormPage; 