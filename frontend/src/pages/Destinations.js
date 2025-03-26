import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Destinations.css";

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/destinations")
      .then(res => setDestinations(res.data))
      .catch(err => console.error("Error loading destinations:", err));
  }, []);

  return (
    <div className="destinations-page">
      <h1>Available Destinations</h1>
      <div className="destination-card-container">
        {destinations.map(dest => (
          <div
            key={dest._id}
            className="destination-card"
            style={{
              backgroundImage: `url(http://localhost:5000${dest.image})`,
            }}
            onClick={() => navigate(`/destination/${dest._id}`)}
          >
            <div className="destination-overlay">
              <h3>{dest.name}</h3>
              <p>${dest.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Destinations;
