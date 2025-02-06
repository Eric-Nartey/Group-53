import  { useState } from "react";
import axios from "../api/api";
import "../Styles/Login.css";
import {Link} from "react-router-dom"
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const [error, setError] = useState("")

  function inputFocus(){
    setError("")
  }

  axios.defaults.withCredentials = true
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
       const response= await axios.post("/api/users/login", { email, password });
       switch (response.status) {
        case 200:
            Swal.fire({
                title: "Login successful",
                icon: "success",
                timer: 2000 // close popup alert after 2 seconds
            });
            navigate('/Admindashboard');
            break;
        case 201:
            Swal.fire({
                title: "Login successful",
                icon: "success",
                timer: 2000 // close popup alert after 2 seconds
            });
            navigate('/u/Dashboard');
            break;

        
        default:
            setError("Too many attempsts, try again later")
            break;
    }
      
    } catch (error) {
      if(error.response.status===400|| error.response.status===404){
         setError("Invalid crediatials")
      }else{
        alert("Login failed!");
      }
      
      console.log(error)
    }
  };

  return (
    <div className="parent">
    <div className="login">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onFocus={inputFocus}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onFocus={inputFocus}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p style={{color:"red"}}>{error}</p>
        <button type="submit" className="submit">Login</button>
        <button type="button" className="link">
        <Link to={"/signup"} > Don't have an account?</Link>
        </button>
        <button><Link to={"/forget_password"}>Forget password?</Link></button>
      </form>
    </div>
    </div>
  );
};

export default Login;
