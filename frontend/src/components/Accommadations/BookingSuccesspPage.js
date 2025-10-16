// src/components/Booking/BookingSuccessPage.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingSuccessPage.css";
import Header from "../Header/header";
import Fotter from "../Fotter/fotter";



function BookingSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div>
      <Header />
    <div className="booking-success-page">
      <h1 className="success-title">🎉 Booking Successful!</h1>
      <p>Thank you, {state.userName}. Your booking has been confirmed.</p>
      <p>
        You booked <strong>{state.qty}</strong> rooms for accommodation ID:{" "}
        <strong>{state.accommodation}</strong>.
      </p>
      <p>Total Paid: Rs.{state.totalPrice}</p>

      <button onClick={() => navigate("/")} className="btn-home">
        Back to Home
      </button>
    </div>
    <Fotter />
    </div>
  );
}

export default BookingSuccessPage;
