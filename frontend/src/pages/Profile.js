import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "../styles/Profile.css";

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/bookings/user/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(response => setBookings(response.data))
      .catch(error => console.error("Error fetching bookings:", error));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      axios.get("http://localhost:5000/api/users/favorites", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(response => setFavorites(response.data))
      .catch(error => console.error("Error fetching favorites:", error));
    }
  }, [user]);

  const cancelBooking = async (bookingId) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/cancel/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: "cancelled" } : booking
      ));
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking.");
    }
  };

  const removeFavorite = async (destinationId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/favorites/${destinationId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFavorites(favorites.filter(dest => dest._id !== destinationId));
    } catch (err) {
      console.error("Error removing favorite:", err);
      alert("Failed to remove favorite.");
    }
  };

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      {user && (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={logout}>Logout</button>
        </>
      )}

      <h2>Your Bookings</h2>
      <ul>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <li key={booking._id} className="booking-card">
              <p><strong>Destination:</strong> {booking.destination.name}</p>
              <p><strong>Location:</strong> {booking.destination.location}</p>
              <p><strong>Travel Date:</strong> {new Date(booking.date).toDateString()}</p>
              <p><strong>Status:</strong> {booking.status}</p>

              {booking.status !== "cancelled" && (
                <button onClick={() => cancelBooking(booking._id)}>Cancel Booking</button>
              )}
            </li>
          ))
        ) : (
          <p>No bookings found.</p>
        )}
      </ul>

      <h2>Your Favorite Destinations</h2>
      <ul>
        {favorites.length > 0 ? (
          favorites.map((fav) => (
            <li key={fav._id} className="booking-card">
              <p><strong>{fav.name}</strong> - {fav.location}</p>
              <p>{fav.description}</p>
              <p><strong>Price:</strong> ${fav.price}</p>
              <button onClick={() => removeFavorite(fav._id)}>Remove from Favorites</button>
            </li>
          ))
        ) : (
          <p>No favorites saved.</p>
        )}
      </ul>
    </div>
  );
}

export default Profile;
