const express = require('express');
const router = express.Router();
const Crane = require('../Models/Crane');

// Create or update crane location
router.post('/', async (req, res) => {
  const { crane_name, latitude, longitude, supervisor_id } = req.body;

  try {
    const newCrane = new Crane({ crane_name, location: { latitude, longitude }, supervisor_id });
    await newCrane.save();
    res.status(201).json(newCrane);
  } catch (error) {
    res.status(500).json({ message: 'Error saving crane data', error });
  }
});

module.exports = router;
