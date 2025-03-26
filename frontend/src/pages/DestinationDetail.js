import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/DestinationDetail.css";

function DestinationDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [destination, setDestination] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  // Fetch destination details
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/destinations/${id}`)
      .then((res) => setDestination(res.data))
      .catch((err) => console.error("Error loading destination:", err));
  }, [id]);

  // Fetch favorites for current user
  useEffect(() => {
    if (user) {
      axios
        .get("http://localhost:5000/api/users/favorites", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setFavorites(res.data.map((d) => d._id)))
        .catch((err) => console.error("Error loading favorites:", err));
    }
  }, [user]);

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!user) return navigate("/login");
    try {
      const isFav = favorites.includes(destination._id);
      if (isFav) {
        await axios.delete(
          `http://localhost:5000/api/users/favorites/${destination._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFavorites(favorites.filter((id) => id !== destination._id));
      } else {
        await axios.post(
          `http://localhost:5000/api/users/favorites/${destination._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFavorites([...favorites, destination._id]);
      }
    } catch (err) {
      console.error("Favorite toggle failed:", err);
    }
  };

  // Handle Book Now navigation
  const handleBooking = () => {
    if (!user) return navigate("/login");
    navigate(`/booking?destination=${destination._id}`);
  };

  if (!destination) return <p>Loading...</p>;

  return (
    <div className="destination-detail">
      {/* Main image */}
      <img
        className="main-image"
        src={`http://localhost:5000${destination.image}`}
        alt={destination.name}
      />

      {/* Destination title */}
      <h2>{destination.name}</h2>
      <p className="location">📍 {destination.location}</p>
      <p className="price"> ${destination.price}</p>

      {/* Description */}
      <p className="description">{destination.description}</p>

      {/* Buttons */}
      <div className="actions">
        <button onClick={handleBooking}>Book Now</button>
        <button onClick={toggleFavorite}>
          {favorites.includes(destination._id)
            ? "❤️ Remove Favorite"
            : "🤍 Add to Favorites"}
        </button>
      </div>

      {/* Places of Interest Section */}
      {destination?.placesOfInterest?.length > 0 && (
        <div className="info-section">
          <h3>Places of Interest</h3>
          <table>
            <tbody>
              {destination.placesOfInterest.map((place, index) => (
                <tr key={index}>
                  <td>{place}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Traveler Notes Section */}
      {destination?.travelerNotes && (
        <div className="info-section">
          <h3>Traveler Notes</h3>
          <table>
            <tbody>
              <tr>
                <th>Local Currency</th>
                <td>{destination.travelerNotes.localCurrency}</td>
              </tr>
              <tr>
                <th>Language Spoken</th>
                <td>{destination.travelerNotes.languageSpoken}</td>
              </tr>
              <tr>
                <th>Time Zone</th>
                <td>{destination.travelerNotes.timeZone}</td>
              </tr>
              <tr>
                <th>Visa Requirement</th>
                <td>{destination.travelerNotes.visaRequirement}</td>
              </tr>
              <tr>
                <th>Cuisine Highlights</th>
                <td>
                  {destination.travelerNotes.localCuisineHighlights?.join(", ")}
                </td>
              </tr>
              <tr>
                <th>Must-Try Dishes</th>
                <td>{destination.travelerNotes.mustTryDishes?.join(", ")}</td>
              </tr>
              <tr>
                <th>Festivals & Events</th>
                <td>
                  {destination.travelerNotes.festivalsAndEvents?.join(", ")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DestinationDetail;
