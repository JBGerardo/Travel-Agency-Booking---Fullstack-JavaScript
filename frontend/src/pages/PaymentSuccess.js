import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
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

    return (
        <div>
            <h1>Payment Successful</h1>
            <p>Thank you for your payment! Your booking is confirmed.</p>
        </div>
    );
};

export default PaymentSuccess;
