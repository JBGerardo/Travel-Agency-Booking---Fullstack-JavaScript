import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./Booking.css";

function Booking() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const destinationId = new URLSearchParams(location.search).get("destination");

  const [destination, setDestination] = useState(null);
  const [travelDate, setTravelDate] = useState("");
  const [bookingId, setBookingId] = useState(null);

  //Fetch destination details
  useEffect(() => {
    if (destinationId) {
      axios.get(`http://localhost:5000/api/destinations/${destinationId}`)
        .then(response => setDestination(response.data))
        .catch(error => console.error("Error fetching destination:", error));
    }
  }, [destinationId]);

  // Handle Booking Submission
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!travelDate) {
        alert("Please select a travel date.");
        return;
    }

    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!token) {
        alert("You must be logged in to book a trip.");
        navigate("/login");
        return;
    }

    try {
        const res = await axios.post("http://localhost:5000/api/bookings", {
            user: user._id,
            destination: destinationId,
            date: travelDate,
        }, {
            headers: { Authorization: `Bearer ${token}` }, 
        });

        setBookingId(res.data.booking._id);
        alert("Booking created! Proceeding to payment...");
        window.location.href = res.data.url; // Redirect to Stripe
    } catch (error) {
        console.error("Booking error:", error.response ? error.response.data : error.message);
        alert(`Booking failed: ${error.response ? error.response.data.message : "Please try again."}`);
    }
};

  // Handle Stripe Payment
  const handlePayment = async (bookingId) => {
    try {
      const res = await axios.post("http://localhost:5000/api/payments/checkout", {
        bookingId,
      });

      window.location.href = res.data.url; // Redirect to Stripe Checkout
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  if (!destination) return <p>Loading destination...</p>;

  return (
    <div className="booking-container">
      <h1>Book Your Trip</h1>
      <h3>{destination.name}</h3>
      <p>{destination.location} - ${destination.price}</p>
      <p>{destination.description}</p>

      <form onSubmit={handleBooking}>
        <label>Select Travel Date:</label>
        <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} required />
        <button type="submit">Confirm Booking & Pay</button>
      </form>
    </div>
  );
}

export default Booking;
