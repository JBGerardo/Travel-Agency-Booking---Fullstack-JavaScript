import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingId = new URLSearchParams(location.search).get("bookingId");

  useEffect(() => {
    if (bookingId) {
      axios.put(`http://localhost:5000/api/bookings/update/${bookingId}`, {
        status: "confirmed",
      })
      .then(() => {
        alert("Payment successful! Your booking is confirmed.");
        navigate("/profile");
      })
      .catch(error => console.error("Error updating booking:", error));
    }
  }, [bookingId, navigate]);

  return <h2>Processing Payment...</h2>;
}

export default PaymentSuccess;
