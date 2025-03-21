import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");       // Stores email input
  const [password, setPassword] = useState(""); // Stores password input
  const { login } = useContext(AuthContext);    // Use global authentication context
  const navigate = useNavigate();               // Used for redirecting after login

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      await login(email, password); // Call login function
  
      // Redirect based on role
      const storedToken = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${storedToken}` }
      });
  
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
  
    } catch (err) {
      alert("Invalid credentials");
    }
  };
  
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <p>Don't have an account? <Link to="/register">Sign up here</Link></p>
    </div>
  );
}

export default Login;
