// Full Updated AdminDashboard.js including Add Destination tab

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [destinations, setDestinations] = useState([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDestination, setEditDestination] = useState(null);

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

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (user?.role === "admin" && token) {
      axios
        .get("http://localhost:5000/api/admin/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setBookings(res.data))
        .catch(console.error);
      axios
        .get("http://localhost:5000/api/admin/payments", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setPayments(res.data))
        .catch(console.error);
      axios
        .get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUsers(res.data))
        .catch(console.error);
      axios
        .get("http://localhost:5000/api/destinations")
        .then((res) => setDestinations(res.data))
        .catch(console.error);
    }
  }, [user]);

  const handleCancel = async (bookingId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/cancel/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
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

  const handleEdit = (destination) => {
    setEditDestination({
      ...destination,
      gallery: destination.gallery || [],
      placesOfInterest: destination.placesOfInterest || [],
      travelerNotes: {
        localCurrency: "",
        languageSpoken: "",
        timeZone: "",
        visaRequirement: "",
        localCuisineHighlights: [],
        mustTryDishes: [],
        festivalsAndEvents: [],
        ...(destination.travelerNotes || {}),
      },
    });
    setEditModalOpen(true);
  };

  const saveEditChanges = async () => {
    const token = localStorage.getItem("token");
    try {
      const updatedDestination = {
        ...editDestination,
        gallery:
          typeof editDestination.gallery === "string"
            ? editDestination.gallery.split(",").map((g) => g.trim())
            : editDestination.gallery,
        placesOfInterest:
          typeof editDestination.placesOfInterest === "string"
            ? editDestination.placesOfInterest.split(",").map((p) => p.trim())
            : editDestination.placesOfInterest,
        travelerNotes: {
          ...editDestination.travelerNotes,
          localCuisineHighlights: Array.isArray(
            editDestination.travelerNotes.localCuisineHighlights
          )
            ? editDestination.travelerNotes.localCuisineHighlights
            : editDestination.travelerNotes.localCuisineHighlights
                ?.split(",")
                .map((item) => item.trim()) || [],
          mustTryDishes: Array.isArray(
            editDestination.travelerNotes.mustTryDishes
          )
            ? editDestination.travelerNotes.mustTryDishes
            : editDestination.travelerNotes.mustTryDishes
                ?.split(",")
                .map((item) => item.trim()) || [],
          festivalsAndEvents: Array.isArray(
            editDestination.travelerNotes.festivalsAndEvents
          )
            ? editDestination.travelerNotes.festivalsAndEvents
            : editDestination.travelerNotes.festivalsAndEvents
                ?.split(",")
                .map((item) => item.trim()) || [],
        },
      };

      await axios.put(
        `http://localhost:5000/api/destinations/${editDestination._id}`,
        updatedDestination,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Destination updated.");
      setEditModalOpen(false);
      setDestinations((prev) =>
        prev.map((d) =>
          d._id === editDestination._id ? updatedDestination : d
        )
      );
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/destinations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDestinations(destinations.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  //  Handle Add Destination Submission
  const handleAddDestination = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      //  Image: Use input value or default to name-based
      const imagePath = newDestination.image
        ? `/uploads/${newDestination.image.trim()}`
        : `/uploads/${newDestination.name.replace(/\s+/g, "-")}.jpg`;

      //  Gallery: Convert comma-separated list to array of `/uploads/filename`
      const galleryArray = newDestination.gallery
        ? newDestination.gallery.split(",").map((img) => img.trim())
        : [];

      //  Build full payload
      const payload = {
        name: newDestination.name,
        location: newDestination.location,
        price: newDestination.price,
        description: newDestination.description,
        image: imagePath,
        gallery: galleryArray,
        placesOfInterest: newDestination.placesOfInterest
          ? newDestination.placesOfInterest.split(",").map((p) => p.trim())
          : [],
        travelerNotes: {
          localCurrency: newDestination.localCurrency || "",
          languageSpoken: newDestination.languageSpoken || "",
          timeZone: newDestination.timeZone || "",
          visaRequirement: newDestination.visaRequirement || "",
          localCuisineHighlights: newDestination.cuisineHighlights
            ? newDestination.cuisineHighlights.split(",").map((c) => c.trim())
            : [],
          mustTryDishes: newDestination.mustTryDishes
            ? newDestination.mustTryDishes.split(",").map((d) => d.trim())
            : [],
          festivalsAndEvents: newDestination.festivals
            ? newDestination.festivals.split(",").map((f) => f.trim())
            : [],
        },
      };

      //  Send to backend
      await axios.post("http://localhost:5000/api/destinations", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Destination added successfully!");

      //  Reset form
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
      <div className="tab-buttons">
        <button
          className={activeTab === "bookings" ? "active" : ""}
          onClick={() => setActiveTab("bookings")}
        >
          Bookings
        </button>
        <button
          className={activeTab === "payments" ? "active" : ""}
          onClick={() => setActiveTab("payments")}
        >
          Payments
        </button>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={activeTab === "manage" ? "active" : ""}
          onClick={() => setActiveTab("manage")}
        >
          Manage Destinations
        </button>
        <button
          className={activeTab === "add" ? "active" : ""}
          onClick={() => setActiveTab("add")}
        >
          Add Destination
        </button>
      </div>

      {/* Add Destination Form */}
      {activeTab === "add" && (
        <div className="admin-section">
          <h3>Add New Destination</h3>
          <form
            onSubmit={handleAddDestination}
            className="add-destination-form"
          >
            <label>Destination Name:</label>
            <input
              type="text"
              placeholder="Destination Name"
              value={newDestination.name}
              onChange={(e) =>
                setNewDestination({ ...newDestination, name: e.target.value })
              }
              required
            />
            <label>Location:</label>
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
            <label>Price:</label>
            <input
              type="number"
              placeholder="Price"
              value={newDestination.price}
              onChange={(e) =>
                setNewDestination({ ...newDestination, price: e.target.value })
              }
              required
            />
            <label>Description:</label>
            <textarea
              placeholder="Description"
              value={newDestination.description}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  description: e.target.value,
                })
              }
            />
            <label>Places of Interest, Comma separeted:</label>
            <input
              type="text"
              placeholder="Places of Interest (comma separated)"
              value={newDestination.placesOfInterest}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  placesOfInterest: e.target.value,
                })
              }
            />
            <label>Local Currency:</label>
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
            <label>Language Spoken:</label>
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
            <label>Time Zone:</label>
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
            <label>Visa Requirement:</label>
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
            <label>Cuisine Highlights (comma separated):</label>
            <input
              type="text"
              placeholder="Cuisine Highlights (comma separated)"
              value={newDestination.cuisineHighlights}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  cuisineHighlights: e.target.value,
                })
              }
            />
            <label>Must-Try Dishes (comma separated):</label>
            <input
              type="text"
              placeholder="Must-Try Dishes (comma separated)"
              value={newDestination.mustTryDishes}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  mustTryDishes: e.target.value,
                })
              }
            />
            <label>Festivals & Events (comma separated):</label>
            <input
              type="text"
              placeholder="Festivals & Events (comma separated)"
              value={newDestination.festivals}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  festivals: e.target.value,
                })
              }
            />
            <label>Main Image Filename (e.g. Bali-Beach.jpg):</label>
            <input
              type="text"
              placeholder="Main Image Filename (e.g. Bali-Beach.jpg)"
              value={newDestination.image}
              onChange={(e) =>
                setNewDestination({ ...newDestination, image: e.target.value })
              }
            />
            <label>Gallery Images (comma separated filenames):</label>
            <input
              type="text"
              placeholder="Gallery Images (comma separated filenames)"
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

      {/* Bookings Table */}
      {activeTab === "bookings" && (
        <div className="admin-section">
          <h3>All Bookings</h3>
          <div className="table-wrapper">
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
                        <button onClick={() => handleCancel(b._id)}>
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payments Table */}
      {activeTab === "payments" && (
        <div className="admin-section">
          <h3>All Payments</h3>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td>{p.user?.name}</td>
                    <td>${p.amount}</td>
                    <td>{p.status}</td>
                    <td>{new Date(p.createdAt).toDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Table */}
      {activeTab === "users" && (
        <div className="admin-section">
          <h3>All Users</h3>
          <div className="table-wrapper">
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
        </div>
      )}

      {/* Manage Destinations Table */}
      {activeTab === "manage" && (
        <div className="admin-section">
          <h3>Manage Destinations</h3>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((dest) => (
                  <tr key={dest._id}>
                    <td>{dest.name}</td>
                    <td>{dest.location}</td>
                    <td>${dest.price}</td>
                    <td>
                      <button onClick={() => handleEdit(dest)}>Edit</button>
                      <button onClick={() => handleDelete(dest._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/*Modal Destination edit*/}
      {editModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Destination</h3>

            <table>Destination Name:</table>
            <input
              type="text"
              placeholder="Destination Name"
              value={editDestination.name}
              onChange={(e) =>
                setEditDestination({ ...editDestination, name: e.target.value })
              }
            />
            <label>Location:</label>
            <input
              type="text"
              placeholder="Location"
              value={editDestination.location}
              onChange={(e) =>
                setEditDestination({
                  ...editDestination,
                  location: e.target.value,
                })
              }
            />
            <label>Price:</label>
            <input
              type="number"
              placeholder="Price"
              value={editDestination.price}
              onChange={(e) =>
                setEditDestination({
                  ...editDestination,
                  price: e.target.value,
                })
              }
            />
            <label>Description:</label>
            <textarea
              placeholder="Description"
              rows={3}
              value={editDestination.description}
              onChange={(e) =>
                setEditDestination({
                  ...editDestination,
                  description: e.target.value,
                })
              }
            />
            <label>Image (e.g. Bali-Beach.jpg):</label>
            <input
              type="text"
              placeholder="Image (e.g. Bali-Beach.jpg)"
              value={editDestination.image?.replace("/uploads/", "") || ""}
              onChange={(e) =>
                setEditDestination({
                  ...editDestination,
                  image: `/uploads/${e.target.value}`,
                })
              }
            />
            <labe>Gallery Images (comma-separated):</labe>
            <input
              type="text"
              placeholder="Gallery Images (comma-separated)"
              value={editDestination.gallery?.join(", ") || ""}
              onChange={(e) =>
                setEditDestination({
                  ...editDestination,
                  gallery: e.target.value.split(",").map((img) => img.trim()),
                })
              }
            />
            <label>Places of Interest (comma-separated):</label>
            <textarea
              placeholder="Places of Interest (comma-separated)"
              value={editDestination.placesOfInterest?.join(", ") || ""}
              onChange={(e) =>
                setEditDestination({
                  ...editDestination,
                  placesOfInterest: e.target.value
                    .split(",")
                    .map((p) => p.trim()),
                })
              }
            />
            <label>Local Currency:</label>
            <textarea
              placeholder="Local Currency"
              value={editDestination.travelerNotes?.localCurrency || ""}
              onChange={(e) =>
                setEditDestination({
                  ...editDestination,
                  travelerNotes: {
                    ...editDestination.travelerNotes,
                    localCurrency: e.target.value,
                  },
                })
              }
            />
            <label>Language Spoken:</label>
            <textarea
              placeholder="Language Spoken"
              value={editDestination.travelerNotes?.languageSpoken || ""}
              onChange={(e) =>
                setEditDestination({
                  ...editDestination,
                  travelerNotes: {
                    ...editDestination.travelerNotes,
                    languageSpoken: e.target.value,
                  },
                })
              }
            />
            <label>Time Zone:</label>
            <textarea
              placeholder="Time Zone"
              value={editDestination.travelerNotes?.timeZone || ""}
              onChange={(e) =>
                setEditDestination({
                  ...editDestination,
                  travelerNotes: {
                    ...editDestination.travelerNotes,
                    timeZone: e.target.value,
                  },
                })
              }
            />
            <abel>Visa Requirement:</abel>
            <textarea
              placeholder="Visa Requirement"
              value={editDestination.travelerNotes?.visaRequirement || ""}
              onChange={(e) =>
                setEditDestination({
                  ...editDestination,
                  travelerNotes: {
                    ...editDestination.travelerNotes,
                    visaRequirement: e.target.value,
                  },
                })
              }
            />
            <label>Cuisine Highlights (comma-separated):</label>
            <textarea
              placeholder="Cuisine Highlights (comma-separated)"
              value={
                editDestination.travelerNotes?.localCuisineHighlights?.join(
                  ", "
                ) || ""
              }
              onChange={(e) =>
                setEditDestination({
                  ...editDestination,
                  travelerNotes: {
                    ...editDestination.travelerNotes,
                    localCuisineHighlights: e.target.value
                      .split(",")
                      .map((c) => c.trim()),
                  },
                })
              }
            />
            <label>Must-Try Dishes (comma-separated):</label>
            <textarea
              placeholder="Must-Try Dishes (comma-separated)"
              value={
                editDestination.travelerNotes?.mustTryDishes?.join(", ") || ""
              }
              onChange={(e) =>
                setEditDestination({
                  ...editDestination,
                  travelerNotes: {
                    ...editDestination.travelerNotes,
                    mustTryDishes: e.target.value
                      .split(",")
                      .map((d) => d.trim()),
                  },
                })
              }
            />
            <label>Festivals & Events (comma-separated):</label>
            <textarea
              placeholder="Festivals & Events (comma-separated)"
              value={
                editDestination.travelerNotes?.festivalsAndEvents?.join(", ") ||
                ""
              }
              onChange={(e) =>
                setEditDestination({
                  ...editDestination,
                  travelerNotes: {
                    ...editDestination.travelerNotes,
                    festivalsAndEvents: e.target.value
                      .split(",")
                      .map((f) => f.trim()),
                  },
                })
              }
            />

            <div className="modal-buttons">
              <button onClick={saveEditChanges}>Save</button>
              <button onClick={() => setEditModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
