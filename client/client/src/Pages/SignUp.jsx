// SignupPage.jsx
import React, { useState } from 'react';
import '../Styles/Signup.css';
import axios from "../api/api";
import {useNavigate} from 'react-router-dom'


const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    role: 'Supervisor',
  });


  const navigate =useNavigate()
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  

  axios.defaults.withCredentials = true
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
       const response= await axios.post("/api/users/signup", {formData});
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
          <label htmlFor="fullname" className="form-label">Full Name</label>
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
          <label htmlFor="email" className="form-label">Email</label>
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
          <label htmlFor="password" className="form-label">Password</label>
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

        <div className="form-group">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            id="role"
            name="role"
            className="form-select"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="supervisor">Supervisor</option>
            <option value="worker">Worker</option>
          </select>
        </div>

        <button type="submit" className="form-button">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;