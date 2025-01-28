
import { Link } from "react-router-dom";
import "../Styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-logo">Attendance System</h1>
      <ul className="navbar-links">
        <li>
          <Link to="/u/dashboard">Dashboard</Link>
        </li>
        
        <li>
          <Link to="/u/attendance-records">Attendance</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
