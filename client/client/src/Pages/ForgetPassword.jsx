import React, { useState } from 'react';
import { Input, Button, Form, notification } from 'antd';
import axios from "../api/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };


  axios.defaults.withCredentials=true
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      notification.error({
        message: 'Error',
        description: 'Please enter a valid email address',
      });
      return;
    }

    try {
      // Assuming there's an API endpoint for the forgot password
      await axios.post('/api/users/forgot_password', { email });

      notification.success({
        message: 'Password Reset',
        description: 'A password reset link has been sent to your email',
      });
    } catch (err) {
      notification.error({
        message: 'Error',
        description: 'Failed to send reset email. Please try again.',
      });
      console.log(err)
    }
  };

  return (
    <div className="parent">
    <div className="forgot-password-container" style={{ borderRadius:"5px",width: '400px', margin: '0 auto', padding: '40px',background:'white',border:"1px solid #ddd" }}>
      <h2>Forgot Your Password?</h2>
      <Form onSubmit={handleSubmit} layout="vertical">
        <Form.Item label="Email" required>
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email address"
            style={{height:"45px"}}
          />
        </Form.Item>
        <Button type="primary" onClick={handleSubmit} block style={{height:"45px",fontSize:"17px",fontWeight:"600"}}>
          Submit
        </Button>
      </Form>
    </div>
    </div>
  );
};

export default ForgotPassword;
