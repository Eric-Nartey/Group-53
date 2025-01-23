const express = require('express');
const router = express.Router();
const User = require('../Models/User');

// Sample login route (you can add more auth logic later)
router.post('/login', async (req, res) => {
  const { email, password, } = req.body;
  
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
