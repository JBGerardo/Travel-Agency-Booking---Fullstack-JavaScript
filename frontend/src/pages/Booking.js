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

  // Fetch destination details
  useEffect(() => {
    if (destinationId) {
      axios
        .get(`http://localhost:5000/api/destinations/${destinationId}`)
        .then((response) => setDestination(response.data))
        .catch((error) => console.error("Error fetching destination:", error));
    }
  }, [destinationId]);

  // Handle Booking Submission
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!travelDate) {
      alert("Please select a travel date.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to book a trip.");
      navigate("/login");
      return;
    }

    try {
      // Step 1: Create Booking
      const bookingRes = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          user: user._id,
          destination: destinationId,
          date: travelDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!bookingRes.data.booking) {
        throw new Error("Invalid response from the server.");
      }

      setBookingId(bookingRes.data.booking._id);

      alert("Booking created! Proceeding to payment...");
      window.location.href = `/payments?bookingId=${bookingRes.data.booking._id}`;
    } catch (error) {
      console.error("Booking error:", error.response ? error.response.data : error.message);
      alert(`Booking failed: ${error.response ? error.response.data.message : "Please try again."}`);
    }
  };

  return (
    <div className="booking-container">
      <h2>Book Your Trip</h2>
      {destination ? (
        <div>
          <h3>{destination.name}</h3>
          <p>{destination.description}</p>
          <form onSubmit={handleBooking}>
            <label>Select Travel Date:</label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              required
            />
            <button type="submit">Book Now</button>
          </form>
        </div>
      ) : (
        <p>Loading destination details...</p>
      )}
    </div>
  );
}

export default Booking;
