// SignupPage.jsx
import React, { useState } from 'react';
import '../Styles/Signup.css';
import axios from "../api/api";
import {Link} from "react-router-dom"
import {useNavigate} from 'react-router-dom'


const SignupPage = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    role: '',
  });

 
 

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const [selectedGroup, setSelectedGroup] = useState("");

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
  };

  const navigate =useNavigate()
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  

  axios.defaults.withCredentials = true
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
       const response= await axios.post("/api/users/signup", {...formData,selectedRole,selectedGroup});
       if(response.status===200){
          navigate('/')
          alert("Login successful!");
       }else{
          alert("login failed")
       }
      
    } catch (error) {
      alert("Log failed!");
      console.log(error)
    }
  };

  return (
    <div className="signup-page">
      <h1 className="signup-title">Sign Up</h1>
      <form className="signup-form" onSubmit={handleSignup}>
        <div className="form-group">
          
          <input
            type="text"
            id="fullname"
            name="fullname"
            className="form-input"
            value={formData.fullname}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="radio-group">
        {["Lasher", "Foreman", "Clerk", "Worker"].map((role) => (
          <label key={role} className="radio-label">
            <input
              type="radio"
              name="userRole"
              value={role}
              checked={selectedRole === role}
              onChange={handleRoleChange}
            />
            <span className="custom-radio"></span>
            {role}
          </label>
        ))}
      </div>

      <div className="radio-group">
        {["A", "B", "C"].map((group) => (
          <label key={group} className="radio-label">
            <input
              type="radio"
              name="group"
              value={group}
              checked={selectedGroup === group}
              onChange={handleGroupChange}
            />
            <span className="custom-radio"></span>
            Group {group}
          </label>
        ))}
      </div>

        <button type="submit" className="form-button">Sign Up</button>

        <Link to={"/"}>Already have an account?</Link>
      </form>
    </div>
  );
};

export default SignupPage;