
import { NavLink } from "react-router-dom";
import "../Styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-logo">Attendance System</h1>
      <ul className="navbar-links">
        <li>
          <NavLink to="/u/dashboard">Dashboard</NavLink>
        </li>
        
        <li>
          <NavLink to="/u/attendance-records">Attendance</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
