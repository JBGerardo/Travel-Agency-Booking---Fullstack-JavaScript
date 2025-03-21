import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function AdminDestinations() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    image: ""
  });

  const [destinations, setDestinations] = useState([]);

  // Fetch all destinations
  const fetchDestinations = async () => {
    const res = await axios.get("http://localhost:5000/api/destinations");
    setDestinations(res.data);
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle create destination
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/destinations", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Destination added successfully");
      setFormData({ name: "", location: "", price: "", description: "", image: "" });
      fetchDestinations();
    } catch (err) {
      console.error("Error adding destination:", err);
      alert("Failed to add destination");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/destinations/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchDestinations();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="admin-destinations">
      <h2>Add New Destination</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required />
        <button type="submit">Add Destination</button>
      </form>

      <h3>Existing Destinations</h3>
      <ul>
        {destinations.map((dest) => (
          <li key={dest._id} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
            <strong>{dest.name}</strong> — {dest.location} (${dest.price})
            <br />
            <img src={dest.image} alt={dest.name} style={{ width: "200px", height: "auto", marginTop: "5px" }} />
            <br />
            <button onClick={() => handleDelete(dest._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDestinations;
