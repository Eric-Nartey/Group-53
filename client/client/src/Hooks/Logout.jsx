
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "../api/api";

const useLogout = () => {
    const navigate = useNavigate();
  
    const logout = async () => {
      try {
        const response = await axios.post("/api/users/logout", {}, { withCredentials: true });
  
        if (response.status === 200) {
          
          message.success("Logged out successfully!");
          navigate("/"); // Redirect to login page
        } else {
          message.error("Logout failed. Please try again.");
        }
      } catch (error) {
        console.error("Logout error:", error);
        message.error("An error occurred while logging out.");
      }
    };
  
    return logout;
  };
  
  export default useLogout;
    

