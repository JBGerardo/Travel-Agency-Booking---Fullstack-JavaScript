import React from "react";
import ReactDOM from "react-dom/client"; // React 18 uses "createRoot"
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // Authentication Context

// Create root element for React 18+
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App inside the AuthProvider
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
