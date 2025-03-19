import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import Booking from "./pages/Booking";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
