import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "../styles/Profile.css";

function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState("bookings");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Fetch bookings
  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/api/bookings/user/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setBookings(res.data))
        .catch((err) => console.error("Error fetching bookings:", err));
    }
  }, [user]);

  // Fetch favorites
  useEffect(() => {
    if (user) {
      axios
        .get("http://localhost:5000/api/users/favorites", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setFavorites(res.data))
        .catch((err) => console.error("Error fetching favorites:", err));
    }
  }, [user]);

  // Cancel booking
  const cancelBooking = async (bookingId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/cancel/${bookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  // Remove a destination from favorites
  const removeFavorite = async (destinationId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/users/favorites/${destinationId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Update state after removal
      setFavorites((prev) => prev.filter((fav) => fav._id !== destinationId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <div className="profile-container">
      <h1>Welcome, {user?.name}</h1>

      <div className="tab-buttons">
        <button
          onClick={() => setActiveTab("bookings")}
          className={activeTab === "bookings" ? "active" : ""}
        >
          Your Bookings
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={activeTab === "favorites" ? "active" : ""}
        >
          Your Favorite Destinations
        </button>
      </div>

      {activeTab === "bookings" && (
        <div className="tab-section">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <p>
                  <strong>Destination:</strong> {booking.destination.name}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(booking.date).toDateString()}
                </p>
                <p>
                  <strong>Status:</strong> {booking.status}
                </p>
                {booking.status !== "cancelled" && (
                  <button onClick={() => cancelBooking(booking._id)}>
                    Cancel Booking
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No bookings found.</p>
          )}
        </div>
      )}

      {activeTab === "favorites" && (
        <div className="tab-section favorites-section">
          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <div className="favorite-destination-card" key={fav._id}>
                <img
                  src={`http://localhost:5000${fav.image}`}
                  alt={fav.name}
                  className="favorite-image"
                />
                <div className="favorite-info">
                  <h4>{fav.name}</h4>
                  <p>${fav.price}</p>
                  <button
                    className="remove-button"
                    onClick={() => removeFavorite(fav._id)}
                  >
                    Remove from Favorites
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No favorite destinations found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
