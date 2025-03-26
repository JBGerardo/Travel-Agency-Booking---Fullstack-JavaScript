import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      {/* Left section: Logo + Brand */}
      <div className="navbar-left">
      <img src="/logo.png" alt="Logo" className="navbar-logo" />
        <span className="navbar-title">Travel-Agency</span>
      </div>

      {/* Right section: Navigation */}
      <ul className="navbar-links">
        <li><Link to="/destinations">Destinations</Link></li>

        {user?.role === "admin" && (
          <li><Link to="/admin">Admin Dashboard</Link></li>
        )}

        {user ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={logout} className="logout-btn">Logout</button></li>
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
