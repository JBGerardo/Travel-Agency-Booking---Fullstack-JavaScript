import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Check if all imports are correct
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer"; 
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Destinations from "./pages/Destinations";
import Booking from "./pages/Booking";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
