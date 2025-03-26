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
  const [currentSlide, setCurrentSlide] = useState(0); 
  const [showSlider, setShowSlider] = useState(false); 
  const navigate = useNavigate();

  // Fetch destination details
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/destinations/${id}`)
      .then((res) => setDestination(res.data))
      .catch((err) => console.error("Error loading destination:", err));
  }, [id]);

  // Fetch user favorites
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

  // Toggle favorite destination
  const toggleFavorite = async () => {
    if (!user) return navigate("/login");
    try {
      const isFav = favorites.includes(destination._id);
      const url = `http://localhost:5000/api/users/favorites/${destination._id}`;
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      if (isFav) {
        await axios.delete(url, { headers });
        setFavorites(favorites.filter((id) => id !== destination._id));
      } else {
        await axios.post(url, {}, { headers });
        setFavorites([...favorites, destination._id]);
      }
    } catch (err) {
      console.error("Favorite toggle failed:", err);
    }
  };

  // Handle booking redirection
  const handleBooking = () => {
    if (!user) return navigate("/login");
    navigate(`/booking?destination=${destination._id}`);
  };

  // Handle click on a gallery image
  const openSlider = (index) => {
    setCurrentSlide(index);
    setShowSlider(true);
  };

  // Slider navigation handlers
  const nextSlide = () => {
    setCurrentSlide((prev) =>
      destination.gallery && prev < destination.gallery.length - 1 ? prev + 1 : 0
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      destination.gallery && prev > 0 ? prev - 1 : destination.gallery.length - 1
    );
  };

  const closeSlider = () => setShowSlider(false);

  if (!destination) return <p>Loading...</p>;

  return (
    <div className="destination-detail">
      {/* Full-width main image */}
      <img
        className="main-image"
        src={`http://localhost:5000${destination.image}`}
        alt={destination.name}
      />

      <h2>{destination.name}</h2>
      <p className="location">📍 {destination.location}</p>
      <p className="price"><strong>${destination.price}</strong></p>
      <p className="description">{destination.description}</p>

      {/* Action Buttons */}
      <div className="actions">
        <button onClick={handleBooking}>Book Now</button>
        <button onClick={toggleFavorite}>
          {favorites.includes(destination._id) ? "❤️ Remove Favorite" : "🤍 Add to Favorites"}
        </button>
      </div>

      {/* Places of Interest Table */}
      {destination.placesOfInterest?.length > 0 && (
        <div className="info-section highlight-section">
          <h3>Places of Interest</h3>
          <table>
            <tbody>
              {destination.placesOfInterest.map((place, index) => (
                <tr key={index}><td>{place}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Traveler Notes Table */}
      {destination.travelerNotes && (
        <div className="info-section highlight-section">
          <h3>Traveler Notes</h3>
          <table>
            <tbody>
              <tr><th>Local Currency</th><td>{destination.travelerNotes.localCurrency}</td></tr>
              <tr><th>Language Spoken</th><td>{destination.travelerNotes.languageSpoken}</td></tr>
              <tr><th>Time Zone</th><td>{destination.travelerNotes.timeZone}</td></tr>
              <tr><th>Visa Requirement</th><td>{destination.travelerNotes.visaRequirement}</td></tr>
              <tr><th>Cuisine Highlights</th><td>{destination.travelerNotes.localCuisineHighlights?.join(", ")}</td></tr>
              <tr><th>Must-Try Dishes</th><td>{destination.travelerNotes.mustTryDishes?.join(", ")}</td></tr>
              <tr><th>Festivals & Events</th><td>{destination.travelerNotes.festivalsAndEvents?.join(", ")}</td></tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Gallery Section at bottom */}
      {destination.gallery?.length > 0 && (
        <div className="gallery">
          <h3>Gallery</h3>
          <div className="gallery-images">
            {destination.gallery.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5000/uploads/${img}`}
                alt={`Gallery ${index}`}
                onClick={() => openSlider(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Image Slider (lightbox style) */}
      {showSlider && destination.gallery?.length > 0 && (
        <div className="slider-container">
          <div className="slider">
            <button className="prev" onClick={prevSlide}>❮</button>
            <img
              src={`http://localhost:5000/uploads/${destination.gallery[currentSlide]}`}
              alt="Slide"
            />
            <button className="next" onClick={nextSlide}>❯</button>
          </div>
          <button onClick={closeSlider} style={{ marginTop: "1rem" }}>Close</button>
        </div>
      )}
    </div>
  );
}

export default DestinationDetail;
