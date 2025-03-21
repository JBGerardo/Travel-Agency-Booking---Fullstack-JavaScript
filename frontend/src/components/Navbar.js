import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // Get user & logout function

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/destinations">Destinations</Link></li>

        {/* ✅ Only show Admin Dashboard for admin users */}
        {user?.role === "admin" && (
          <li><Link to="/admin">Admin Dashboard</Link></li>
        )}

        {user ? (
          <>
            {/* ✅ Only show Profile for non-admin users */}
            {user.role !== "admin" && (
              <li><Link to="/profile">Profile</Link></li>
            )}
            <li><button onClick={logout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
