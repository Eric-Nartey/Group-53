
import { NavLink } from "react-router-dom";
import "../Styles/Navbar.css";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import useLogout from "../Hooks/Logout";
const Navbar = () => {
  const logout = useLogout();
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
        <li>
          <Button icon={<LogoutOutlined />} onClick={logout} danger>Logout</Button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
