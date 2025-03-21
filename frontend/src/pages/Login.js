import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");       // Stores email input
  const [password, setPassword] = useState(""); // Stores password input
  const { login } = useContext(AuthContext);    // Use global authentication context
  const navigate = useNavigate();               // Used for redirecting after login

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      // Call login function (updates context and localStorage)
      await login(email, password);

      // Retrieve user from localStorage to check their role
      const storedUser = JSON.parse(localStorage.getItem("user"));

      //  Role-based redirect
      if (storedUser?.role === "admin") {
        navigate("/admin");  // Redirect to admin dashboard
      } else {
        navigate("/profile");  // Redirect to user profile
      }
    } catch (err) {
      alert("Invalid credentials"); // Show error if login fails
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
