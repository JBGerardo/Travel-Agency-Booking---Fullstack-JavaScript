import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./Booking.css"; // Add CSS for styling

function Booking() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const destinationId = new URLSearchParams(location.search).get("destination");

  const [destination, setDestination] = useState(null);
  const [travelDate, setTravelDate] = useState("");

  // Fetch the selected destination details
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

    try {
      await axios.post("http://localhost:5000/api/bookings", {
        userId: user._id,
        destinationId,
        travelDate
      });
      alert("Booking confirmed!");
      navigate("/profile"); // Redirect to profile after booking
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed. Please try again.");
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
        <button type="submit">Confirm Booking</button>
      </form>
    </div>
  );
}

export default Booking;
