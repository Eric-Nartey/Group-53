import  { useState } from "react";
import axios from "../api/api";
import "../Styles/Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()


  axios.defaults.withCredentials = true
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
       const response= await axios.post("/api/users/login", { email, password });
       if(response.status===200){
          navigate('/dashboard')
          alert("Login successful!");
       }else{
          alert("login failed")
       }
      
    } catch (error) {
      alert("Login failed!");
      console.log(error)
    }
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
