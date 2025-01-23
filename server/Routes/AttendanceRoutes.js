const express = require('express');
const router = express.Router();
const Attendance = require('../Models/Attendance');

// Record attendance for a user
router.post('/', async (req, res) => {
  const { user_id, shift_id, date, sign_in_time } = req.body;

  try {
    const newAttendance = new Attendance({ user_id, shift_id, date, sign_in_time });
    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(500).json({ message: 'Error recording attendance', error });
  }
});

// Mark sign-out for attendance
router.put('/:attendance_id', async (req, res) => {
  const { attendance_id } = req.params;
  const { sign_out_time } = req.body;

  try {
    const attendance = await Attendance.findByIdAndUpdate(
      attendance_id,
      { sign_out_time },
      { new: true }
    );
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error updating attendance', error });
  }
});

module.exports = router;
