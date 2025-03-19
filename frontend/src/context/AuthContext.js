import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create authentication context to manage user state across the app
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Stores user info
  const [token, setToken] = useState(localStorage.getItem("token") || "");  // Store JWT token

  // Fetch user profile when token is available
  useEffect(() => {
    if (token) {
      axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUser(res.data))
      .catch(() => setUser(null)); // Clear user if token is invalid
    }
  }, [token]);

  // Function to log in user and store token
  const login = async (email, password) => {
    const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  // Function to log out user and clear token
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children} {/* Provides authentication state to entire app */}
    </AuthContext.Provider>
  );
};
