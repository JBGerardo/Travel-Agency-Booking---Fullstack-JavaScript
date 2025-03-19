import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/destinations">Destinations</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
