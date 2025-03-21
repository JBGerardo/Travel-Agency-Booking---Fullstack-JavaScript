import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css"; // (optional) Create this CSS file for styling

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  // Redirect if not an admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch all bookings for admin view
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (user?.role === "admin" && token) {
      axios
        .get("http://localhost:5000/api/admin/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setBookings(res.data))
        .catch((err) => console.error("Failed to fetch admin bookings:", err));
    }
  }, [user]);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Destination</th>
            <th>Location</th>
            <th>Price</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.user?.name}</td>
              <td>{booking.user?.email}</td>
              <td>{booking.destination?.name}</td>
              <td>{booking.destination?.location}</td>
              <td>${booking.destination?.price}</td>
              <td>{booking.status}</td>
              <td>{new Date(booking.date).toDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
