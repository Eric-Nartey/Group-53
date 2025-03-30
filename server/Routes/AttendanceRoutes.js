const express = require('express');
const router = express.Router();
const Attendance = require('../Models/Attendance');
const { Radio, Lxe } = require('../Models/Radio&Lxe');
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
    const attendance = await Attendance.find({ userId })
      .populate({
        path: 'radio_id',
        select: 'radio_number', // Only fetch the radio_number field
      })
      .populate({
        path: 'Lxe_id',
        select: 'lxe_number', // Only fetch the lxeNumber field
      });

      console.log("Attendance Record:", attendance);
    if (!attendance) {
      console.log("Attendance not found")
      return res.status(404).json({ message: 'Attendance not found' });
    }
    res.status(200).json(attendance)
  }catch(error){
    console.log("Error getting attendance",error)
    res.status(500).json({message: 'Error getting attendace', error})
  }
  
})

router.delete("/:id",verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the attendance record exists
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      console.log("Attendance record not found")
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Delete the record
    await Attendance.findByIdAndDelete(id);
    res.status(200).json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    console.error("Error deleting attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/', verifyAdmin, async (req, res) => {
  try {
    const attendance = await Attendance.find({}).populate('userId', 'fullname'); // Populate userId with only the username field
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error getting attendance', error });
  }
});


module.exports = router;
