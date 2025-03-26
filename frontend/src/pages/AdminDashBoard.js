import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Tabs: "bookings", "payments", "users", "addDestination"
  const [activeTab, setActiveTab] = useState("bookings");

  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);

  const [newDestination, setNewDestination] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    image: "",
    gallery: "",
    placesOfInterest: "",
    localCurrency: "",
    languageSpoken: "",
    timeZone: "",
    visaRequirement: "",
    cuisineHighlights: "",
    mustTryDishes: "",
    festivals: "",
  });

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch admin data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (user?.role === "admin" && token) {
      axios.get("http://localhost:5000/api/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => setBookings(res.data)).catch(console.error);

      axios.get("http://localhost:5000/api/admin/payments", {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => setPayments(res.data)).catch(console.error);

      axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => setUsers(res.data)).catch(console.error);
    }
  }, [user]);

  const handleCancel = async (bookingId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:5000/api/bookings/cancel/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: "cancelled" } : b));
    } catch (err) {
      console.error("Cancel booking failed:", err);
      alert("Failed to cancel booking.");
    }
  };

  const handleAddDestination = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const imageName = newDestination.name.replace(/\s+/g, "-") + ".jpg";
      const imagePath = `/uploads/${imageName}`;
      const galleryArray = newDestination.gallery
        ? newDestination.gallery.split(",").map(img => `/uploads/${img.trim()}`)
        : [];

      const destinationPayload = {
        name: newDestination.name,
        location: newDestination.location,
        price: newDestination.price,
        description: newDestination.description,
        image: imagePath,
        gallery: galleryArray,
        placesOfInterest: newDestination.placesOfInterest
          ? newDestination.placesOfInterest.split(",").map(p => p.trim())
          : [],
        travelerNotes: {
          localCurrency: newDestination.localCurrency,
          languageSpoken: newDestination.languageSpoken,
          timeZone: newDestination.timeZone,
          visaRequirement: newDestination.visaRequirement,
          localCuisineHighlights: newDestination.cuisineHighlights
            ? newDestination.cuisineHighlights.split(",").map(c => c.trim())
            : [],
          mustTryDishes: newDestination.mustTryDishes
            ? newDestination.mustTryDishes.split(",").map(d => d.trim())
            : [],
          festivalsAndEvents: newDestination.festivals
            ? newDestination.festivals.split(",").map(f => f.trim())
            : [],
        },
      };

      await axios.post("http://localhost:5000/api/destinations", destinationPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Destination added successfully!");

      setNewDestination({
        name: "",
        location: "",
        price: "",
        description: "",
        image: "",
        gallery: "",
        placesOfInterest: "",
        localCurrency: "",
        languageSpoken: "",
        timeZone: "",
        visaRequirement: "",
        cuisineHighlights: "",
        mustTryDishes: "",
        festivals: "",
      });
    } catch (err) {
      console.error("Add destination failed:", err);
      alert("Failed to add destination.");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* TAB BUTTONS */}
      <div className="tab-buttons">
        <button className={activeTab === "bookings" ? "active" : ""} onClick={() => setActiveTab("bookings")}>Bookings</button>
        <button className={activeTab === "payments" ? "active" : ""} onClick={() => setActiveTab("payments")}>Payments</button>
        <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>Users</button>
        <button className={activeTab === "addDestination" ? "active" : ""} onClick={() => setActiveTab("addDestination")}>Add Destination</button>
      </div>

      {/* BOOKINGS */}
      {activeTab === "bookings" && (
        <div className="admin-section">
          <h3>All Bookings</h3>
          <table className="admin-table">
            <thead>
              <tr><th>User</th><th>Email</th><th>Destination</th><th>Date</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id}>
                  <td>{b.user?.name}</td>
                  <td>{b.user?.email}</td>
                  <td>{b.destination?.name}</td>
                  <td>{new Date(b.date).toDateString()}</td>
                  <td>{b.status}</td>
                  <td>{b.status !== "cancelled" && (
                    <button onClick={() => handleCancel(b._id)}>Cancel</button>
                  )}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAYMENTS */}
      {activeTab === "payments" && (
        <div className="admin-section">
          <h3>All Payments</h3>
          <table className="admin-table">
            <thead>
              <tr><th>User</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p._id}>
                  <td>{p.user?.name}</td>
                  <td>${p.amount}</td>
                  <td>{p.paymentMethod}</td>
                  <td>{p.status}</td>
                  <td>{new Date(p.createdAt).toDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* USERS */}
      {activeTab === "users" && (
        <div className="admin-section">
          <h3>All Users</h3>
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD DESTINATION */}
      {activeTab === "addDestination" && (
        <div className="admin-section">
          <h3>Add New Destination</h3>
          <form onSubmit={handleAddDestination} className="add-destination-form">
            {/* Inputs for each destination field */}
            <input type="text" placeholder="Destination Name" value={newDestination.name} onChange={(e) => setNewDestination({ ...newDestination, name: e.target.value })} required />
            <input type="text" placeholder="Location" value={newDestination.location} onChange={(e) => setNewDestination({ ...newDestination, location: e.target.value })} required />
            <input type="number" placeholder="Price" value={newDestination.price} onChange={(e) => setNewDestination({ ...newDestination, price: e.target.value })} required />
            <textarea placeholder="Description" value={newDestination.description} onChange={(e) => setNewDestination({ ...newDestination, description: e.target.value })} />
            <input type="text" placeholder="Places of Interest (comma separated)" value={newDestination.placesOfInterest} onChange={(e) => setNewDestination({ ...newDestination, placesOfInterest: e.target.value })} />
            <input type="text" placeholder="Local Currency" value={newDestination.localCurrency} onChange={(e) => setNewDestination({ ...newDestination, localCurrency: e.target.value })} />
            <input type="text" placeholder="Language Spoken" value={newDestination.languageSpoken} onChange={(e) => setNewDestination({ ...newDestination, languageSpoken: e.target.value })} />
            <input type="text" placeholder="Time Zone" value={newDestination.timeZone} onChange={(e) => setNewDestination({ ...newDestination, timeZone: e.target.value })} />
            <input type="text" placeholder="Visa Requirement" value={newDestination.visaRequirement} onChange={(e) => setNewDestination({ ...newDestination, visaRequirement: e.target.value })} />
            <input type="text" placeholder="Cuisine Highlights (comma separated)" value={newDestination.cuisineHighlights} onChange={(e) => setNewDestination({ ...newDestination, cuisineHighlights: e.target.value })} />
            <input type="text" placeholder="Must-Try Dishes (comma separated)" value={newDestination.mustTryDishes} onChange={(e) => setNewDestination({ ...newDestination, mustTryDishes: e.target.value })} />
            <input type="text" placeholder="Festivals & Events (comma separated)" value={newDestination.festivals} onChange={(e) => setNewDestination({ ...newDestination, festivals: e.target.value })} />
            <input type="text" placeholder="Gallery Images (comma separated filenames)" value={newDestination.gallery} onChange={(e) => setNewDestination({ ...newDestination, gallery: e.target.value })} />
            <button type="submit">Add Destination</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
