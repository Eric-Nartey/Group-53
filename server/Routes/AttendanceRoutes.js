const express = require('express');
const router = express.Router();
const Attendance = require('../Models/Attendance');
const verifyRefreshToken= require('../Middleware/Middleware');
const { Radio, Lxc } = require('../Models/Radio&Lxc');
// Record attendance for a user


router.post('/attendance',verifyRefreshToken, async (req, res) => {
  const { user_id, shift_id,radio,lxc, date, sign_in_time } = req.body;

  try {
    const radioIndetification= await Radio.findOne({radio_number:radio})
    if(!radioIndetification) return res.status(404).json({message:'Radio numder not found'}) 
      const lxcIndetification= await Lxc.findOne({lxc_number:lxc})
    if(!lxcIndetification) return res.status(404).json({message:'lxc numder not found'}) 
    const newAttendance = new Attendance({ user_id, shift_id, date,sign_in_time });
    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(500).json({ message: 'Error recording attendance', error });
  }
});

// Mark sign-out for attendance
router.put('/:attendance_id',verifyRefreshToken, async (req, res) => {
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
