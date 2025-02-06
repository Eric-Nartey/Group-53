import React, { useState, useEffect } from 'react';
import { Input, Button, notification } from 'antd';
import {useNavigate} from "react-router-dom"
import axios from "../api/api";
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams(); // Get the reset token from URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate= useNavigate()

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      notification.error({
        message: 'Error',
        description: 'Passwords do not match',
      });
      return;
    }

    try {
      // Assuming an endpoint exists for resetting the password
      await axios.post('/api/users/reset-password', { token, password });
      
      notification.success({
        message: 'Password Reset',
        description: 'Your password has been successfully reset',
      });
      navigate("/")
    } catch (err) {
        if (err && err.status === 400) {
            notification.error({
              message: 'Error',
              description: 'Reset token expired',
            });
            return;
          }
      notification.error({
        message: 'Error',
        description: 'Failed to reset password. Please try again.',
      });
    }
  };

  return (
    <div className="parent">
    <div className="reset-password-container" style={{ borderRadius:"5px",width: '400px', margin: '0 auto', padding: '40px',background:'white',border:"1px solid #ddd" }}>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <Input.Password
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter your new password"
          required
          style={{height:"45px",marginTop:"20px"}}
        />
        <Input.Password
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="Confirm your new password"
          required
          style={{height:"45px",marginTop:"20px"}}
        />
        <Button type="primary" onClick={handleSubmit} block style={{height:"45px",fontSize:"17px",fontWeight:"600",marginTop:"20px"}}>
          Submit
        </Button>
      </form>
    </div>
    </div>
  );
};

export default ResetPassword;
