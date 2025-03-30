const express = require('express');
const router = express.Router();
const Attendance = require('../Models/Attendance');
const { Radio, Lxc } = require('../Models/Radio&Lxc');
const verifyAdmin = require('../Middleware/Adminware');
const verifyRefreshToken = require('../Middleware/Middleware');
// Record attendance for a user




// Mark sign-out for attendance
router.put('/:attendance_id',verifyAdmin, async (req, res) => {
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

router.get('/get-attendance',verifyRefreshToken, async (req, res)=>{
  const userId= req.user.id
  try{
    const attendance = await Attendance.find({userId:userId})
    res.status(200).json(attendance)
  }catch(error){
    res.status(500).json({message: 'Error getting attendace', error})
  }
  
})

router.get('/', verifyAdmin, async (req, res) => {
  try {
    const attendance = await Attendance.find({}).populate('userId', 'fullname'); // Populate userId with only the username field
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error getting attendance', error });
  }
});


module.exports = router;
