import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // Get user & logout function

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/destinations">Destinations</Link></li>
        {user ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={logout}>Logout</button></li> {/* Logout now works correctly */}
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Sign Up</Link></li> {/* Added Sign Up link */}
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
