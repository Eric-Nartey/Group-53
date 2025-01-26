const express = require('express');
const router = express.Router();
const Supervisor = require('../Models/Supervisor');
const verifyAdmin = require('../Middleware/Adminware');

// Create a supervisor and assign a radio
router.post('/',verifyAdmin, async (req, res) => {
  const { user_id, assigned_radio } = req.body;
  
  try {
    const newSupervisor = new Supervisor({ user_id, assigned_radio });
    await newSupervisor.save();
    res.status(201).json(newSupervisor);
  } catch (error) {
    res.status(500).json({ message: 'Error creating supervisor', error });
  }
});

module.exports = router;
