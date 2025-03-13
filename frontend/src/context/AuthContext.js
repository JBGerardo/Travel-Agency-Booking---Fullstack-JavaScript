import React, { createContext, useState, useEffect } from "react";
import { api } from "../services/api";

// Create an authentication context
export const AuthContext = createContext();

// AuthProvider will wrap the whole app and provide auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store logged-in user info
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // Store JWT token

  // Fetch user profile if token exists
  useEffect(() => {
    if (token) {
      api.get("/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, [token]);

  // Function to log in user
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token); // Save token
    setToken(res.data.token);
    setUser(res.data.user);
  };

  // Function to log out user
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
