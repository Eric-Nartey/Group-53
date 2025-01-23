const express = require('express');
const router = express.Router();
const User = require('../Models/User');

// Create a new user (Worker/Supervisor)
router.post('/', async (req, res) => {
  const { name, role, email, phone } = req.body;
  
  try {
    const newUser = new User({ name, role, email, phone });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

module.exports = router;
