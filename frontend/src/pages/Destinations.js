import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/Destinations.css";

function Destinations() {
  const { user } = useContext(AuthContext);
  const [destinations, setDestinations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  // Fetch all destinations
  useEffect(() => {
    axios.get("http://localhost:5000/api/destinations")
      .then(res => setDestinations(res.data))
      .catch(err => console.error("Error loading destinations:", err));
  }, []);

  // Fetch user's favorites
  useEffect(() => {
    if (user) {
      axios.get("http://localhost:5000/api/users/favorites", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(res => setFavorites(res.data.map(d => d._id)))
      .catch(err => console.error("Error loading favorites:", err));
    }
  }, [user]);

  // Toggle favorite status
  const toggleFavorite = async (destinationId) => {
    try {
      const isFav = favorites.includes(destinationId);

      if (isFav) {
        await axios.delete(`http://localhost:5000/api/users/favorites/${destinationId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFavorites(favorites.filter(id => id !== destinationId));
      } else {
        await axios.post(`http://localhost:5000/api/users/favorites/${destinationId}`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFavorites([...favorites, destinationId]);
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
    }
  };

  return (
    <div className="destinations-page">
      <h1>Available Destinations</h1>
      <div className="destination-list">
        {destinations.map(dest => (
          <div className="destination-card" key={dest._id}>
            {/* Display Image */}
            {dest.image ? (
              <img src={`http://localhost:5000${dest.image}`} alt={dest.name} className="destination-image" />
            ) : (
              <p>No Image Available</p>
            )}

            <h3>{dest.name}</h3>
            <p><strong>Location:</strong> {dest.location}</p>
            <p><strong>Description:</strong> {dest.description}</p>
            <p><strong>Price:</strong> ${dest.price}</p>

            {/* Favorite button */}
            {user && (
              <button className="heart-button" onClick={() => toggleFavorite(dest._id)}>
                {favorites.includes(dest._id) ? "❤️" : "🤍"} 
              </button>
            )}

            <button onClick={() => navigate(`/booking?destination=${dest._id}`)}>Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Destinations;
