import axios from "axios";

// Set base URL for backend API
const API_URL = "http://localhost:5000/api";

// Create an axios instance to use across the app
export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});
