import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);

  // For Add Destination form
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

  // Fetch bookings, payments, and users
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (user?.role === "admin" && token) {
      axios
        .get("http://localhost:5000/api/admin/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setBookings(res.data))
        .catch((err) => console.error("Failed to fetch bookings:", err));

      axios
        .get("http://localhost:5000/api/admin/payments", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setPayments(res.data))
        .catch((err) => console.error("Failed to fetch payments:", err));

      axios
        .get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUsers(res.data))
        .catch((err) => console.error("Failed to fetch users:", err));
    }
  }, [user]);

  // Cancel booking
  const handleCancel = async (bookingId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/cancel/${bookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (err) {
      console.error("Cancel booking failed:", err);
      alert("Failed to cancel booking.");
    }
  };

 // Handle Add Destination
const handleAddDestination = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  try {
    // Automatically generate the main image filename based on the destination name
    const imageName = newDestination.name.replace(/\s+/g, "-") + ".jpg";
    const imagePath = `/uploads/${imageName}`;

    // Convert gallery input (comma-separated) to an array of proper image paths
    const galleryArray = newDestination.gallery
      ? newDestination.gallery.split(",").map(img => `/uploads/${img.trim()}`)
      : [];

    // Build the full destination object with nested travelerNotes
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

    // Send POST request to backend
    await axios.post(
      "http://localhost:5000/api/destinations",
      destinationPayload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Destination added successfully!");

    // Reset form
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

      {/* All Bookings Section */}
      <div className="admin-section">
        <h3>All Bookings</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Destination</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.user?.name}</td>
                <td>{b.user?.email}</td>
                <td>{b.destination?.name}</td>
                <td>{new Date(b.date).toDateString()}</td>
                <td>{b.status}</td>
                <td>
                  {b.status !== "cancelled" && (
                    <button onClick={() => handleCancel(b._id)}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* All Payments Section */}
      <div className="admin-section">
        <h3>All Payments</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
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

      {/* All Users Section */}
      <div className="admin-section">
        <h3>All Users</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Destination Section */}
      {user?.role === "admin" && (
        <div className="admin-section">
          <h3>Add New Destination</h3>
          <form
            onSubmit={handleAddDestination}
            className="add-destination-form"
          >
            <input
              type="text"
              placeholder="Destination Name"
              value={newDestination.name}
              onChange={(e) =>
                setNewDestination({ ...newDestination, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={newDestination.location}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  location: e.target.value,
                })
              }
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={newDestination.price}
              onChange={(e) =>
                setNewDestination({ ...newDestination, price: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newDestination.image}
              onChange={(e) =>
                setNewDestination({ ...newDestination, image: e.target.value })
              }
            />
            <textarea
              row="4"
              placeholder="Description"
              value={newDestination.description}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  description: e.target.value,
                })
              }
            />
            <textarea
              placeholder="Places of Interest"
              value={newDestination.placesOfInterest}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  placesOfInterest: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Local Currency"
              value={newDestination.localCurrency}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  localCurrency: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Language Spoken"
              value={newDestination.languageSpoken}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  languageSpoken: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Time Zone"
              value={newDestination.timeZone}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  timeZone: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Visa Requirement"
              value={newDestination.visaRequirement}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  visaRequirement: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Cuisine Highlights"
              value={newDestination.cuisineHighlights}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  cuisineHighlights: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Must-Try Dishes"
              value={newDestination.mustTryDishes}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  mustTryDishes: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Popular Festivals"
              value={newDestination.festivals}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  festivals: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Gallery Images (comma-separated filenames)"
              value={newDestination.gallery}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  gallery: e.target.value,
                })
              }
            />
            <button type="submit">Add Destination</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
