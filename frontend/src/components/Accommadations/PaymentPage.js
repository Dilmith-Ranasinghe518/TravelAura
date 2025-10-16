// src/components/Booking/PaymentPage.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import Header from "../Header/header";
import Fotter from "../Fotter/fotter";


function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });

  const handleChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handlePay = async (e) => {
    e.preventDefault();

    // ✅ Defensive check: ensure state & accommodation exist
    if (!state) {
      alert("Missing booking details. Please restart the booking process.");
      // navigate("/"); // send back to home
      return;
    }

    const packageId = state?.accommodation?._id;
    if (!packageId) {
      alert("No package ID found. Please try again.");
      navigate("/"); 
      return;
    }

    const bookingPayload = {
      userName: state.userName || "Guest",
      email: state.email || "no-email@example.com",
      phone: state.phone || "N/A",
      accommodation: packageId, // ✅ safe access
      qty: state.qty || 1,
      totalPrice: state.totalPrice || 0,
    };

    try {
      const res = await fetch("http://localhost:5001/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      if (res.ok) {
        navigate("/booking-success", { state: bookingPayload });
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Payment failed: ${errData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <Header />
    <div className="payment-page">
      <h1 className="payment-title">Payment Gateway</h1>
      <form onSubmit={handlePay} className="payment-form">
        <label>
          Card Number:
          <input
            type="text"
            name="number"
            value={card.number}
            onChange={handleChange}
            required
            placeholder="1111 2222 3333 4444"
          />
        </label>
        <label>
          Expiry Date:
          <input
            type="text"
            name="expiry"
            value={card.expiry}
            onChange={handleChange}
            required
            placeholder="MM/YY"
          />
        </label>
        <label>
          CVV:
          <input
            type="password"
            name="cvv"
            value={card.cvv}
            onChange={handleChange}
            required
            placeholder="123"
          />
        </label>

        {/* ✅ Safe check: state may be undefined */}
        <p className="payment-total">
          Pay Rs.{state?.totalPrice ? state.totalPrice : "0"}
        </p>

        <button type="submit" className="btn-pay">Pay Now</button>
      </form>

      <div className="payment-sample">
        <h3>💳 Sample Test Card</h3>
        <p>Card: 1111 2222 3333 4444</p>
        <p>Expiry: 12/25</p>
        <p>CVV: 123</p>
      </div>
    </div>
    <Fotter />
    </div>
  );
}

export default PaymentPage;
