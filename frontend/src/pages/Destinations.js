import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Destinations.css"; // Add CSS for styling

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();

  // Fetch destinations from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/destinations")
      .then((response) => setDestinations(response.data))
      .catch((error) => console.error("Error fetching destinations:", error));
  }, []);

  // Redirect to Booking Page when a destination is selected
  const handleBooking = (destinationId) => {
    navigate(`/booking?destination=${destinationId}`);
  };

  return (
    <div className="destinations-container">
      <h1>Available Destinations</h1>
      <ul>
        {destinations.map((destination) => (
          <li key={destination._id} className="destination-card">
            <h3>{destination.name}</h3>
            <p>{destination.location} - ${destination.price}</p>
            <p>{destination.description}</p>
            <button onClick={() => handleBooking(destination._id)}>Book Now</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Destinations;
