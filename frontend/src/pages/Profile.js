import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

    //  Redirect admin users to /admin
    useEffect(() => {
      if (user?.role === "admin") {
        navigate("/admin");
      }
    }, [user, navigate]);

  // Fetch user bookings
  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/bookings/user/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(response => setBookings(response.data))
      .catch(error => console.error("Error fetching bookings:", error));
    }
  }, [user]);

  // Function to cancel a booking
  const cancelBooking = async (bookingId) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/cancel/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Update UI: Remove the cancelled booking
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: "cancelled" } : booking
      ));
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking.");
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

              {/* Show "Cancel Booking" button only if status is NOT cancelled */}
              {booking.status !== "cancelled" && (
                <button onClick={() => cancelBooking(booking._id)}>Cancel Booking</button>
              )}
            </li>
          ))
        ) : (
          <p>No bookings found.</p>
        )}
      </ul>
    </div>
  );
}

export default Profile;
