import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Booking.css";

function Booking() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const destinationId = new URLSearchParams(location.search).get("destination");

  const [destination, setDestination] = useState(null);
  const [travelDate, setTravelDate] = useState("");
  const [tripType, setTripType] = useState("one-way");
  const [includeHotel, setIncludeHotel] = useState(false);
  const [numPeople, setNumPeople] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch destination info from MongoDB by ID
  useEffect(() => {
    if (destinationId) {
      axios
        .get(`http://localhost:5000/api/destinations/${destinationId}`)
        .then((res) => setDestination(res.data))
        .catch((err) => console.error("Error fetching destination:", err));
    }
  }, [destinationId]);

  // Recalculate price when booking options change
  useEffect(() => {
    if (destination) {
      let base = destination.price;
      let multiplier = tripType === "roundtrip" ? 1.8 : 1;
      let hotelCost = includeHotel ? 500 : 0;
      let calculated = (base * multiplier + hotelCost) * numPeople;

      setTotalPrice(calculated);
    }
  }, [destination, tripType, includeHotel, numPeople]);

  // Submit booking to backend
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
      // Step 1: Save booking to database
      const bookingRes = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          user: user._id,
          destination: destinationId,
          date: travelDate,
          tripType,
          includeHotel,
          numPeople,
          totalPrice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const bookingId = bookingRes.data.booking._id;

      // Step 2: Send to Stripe Checkout
      const paymentRes = await axios.post(
        "http://localhost:5000/api/payments/create-checkout-session",
        { bookingId, calculatedPrice: totalPrice },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Step 3: Redirect to Stripe
      window.location.href = paymentRes.data.url;
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Booking failed. Please try again.");
    }
  };

  return (
    <div className="booking-container">
      <h2>Book Your Trip</h2>

      {destination ? (
        <div>
          <h3>{destination.name}</h3>
          <p style={{ fontStyle: "italic", marginBottom: "1rem" }}>
            ✈️ All flights depart from <strong>Edmonton</strong> to your selected destination.
          </p>

          {/* Display destination banner */}
          <img
            src={`http://localhost:5000${destination.image}`}
            alt={destination.name}
            className="booking-image"
          />

          <form onSubmit={handleBooking}>
            {/* Travel Date */}
            <label>Travel Date:</label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              required
            />

            {/* Trip Type Dropdown */}
            <label>Trip Type:</label>
            <select
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
            >
              <option value="one-way">One-way</option>
              <option value="roundtrip">Roundtrip</option>
            </select>

            {/* Hotel Option */}
            <label>Include Hotel (10 days):</label>
            <input
              type="checkbox"
              checked={includeHotel}
              onChange={() => setIncludeHotel(!includeHotel)}
            />

            {/* Number of Travelers */}
            <label>Number of Travelers:</label>
            <select
              value={numPeople}
              onChange={(e) => setNumPeople(parseInt(e.target.value))}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>

            {/* Total Price Summary */}
            <p>
              <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
            </p>

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
