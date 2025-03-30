const express = require("express")
const router = express.Router()
const Attendance = require("../Models/Attendance");
const verifyRefreshToken = require("../Middleware/Middleware");
const { Radio, Lxe } = require('../Models/Radio&Lxe');


router.post("/start-shift", verifyRefreshToken, async (req, res) => {
    const { currentShift,lxeNumber,radioNumber,location } = req.body;
    const userId = req.user?.id;

    console.log("Request Body:", req.body);
    console.log("User ID from Token:", userId);

    if (!currentShift || !userId) {
        return res.status(400).json({ message: "Invalid input: Missing currentShift or userId." });
    }

    try {

        const find_radio= await Radio.findOne({radio_number: radioNumber})
    
    if(!find_radio){
        console.log("radio not found")
      return res.status(404).json({message:"You enter a wrong radio"})
    }
    let find_lxe ;
    if (lxeNumber !== "") { 
        console.log(lxeNumber)
         find_lxe = await Lxe.findOne({ lxe_number: lxeNumber});
        console.log("find",find_lxe)
        if (!find_lxe) {
          console.log("LXE not found");
          return res.status(404).json({ message: "You entered a wrong LXE" });
        }
      }

      const startOfDay = new Date();
        startOfDay.setUTCHours(0, 0, 0, 0); // Start of today in UTC

        const endOfDay = new Date();
        endOfDay.setUTCHours(23, 59, 59, 999); // End of today in UTC

      
      const attendance = await Attendance.findOne({
        $or: [
          { radio_number: radioNumber },
          { lxe_number: lxeNumber }
        ],
        sign_out_time: null,
        createdAt: { $gte: startOfDay, $lte: endOfDay } // Ensure createdAt is today
      });
      console.log("Attendance Record:", attendance);
  
      if (attendance) {
        console.log("Radio or LXE exists and has not signed out:", attendance);
       return res.status(400).json({message: "Radio or LXE exists and has not signed out"})
      } else {
        console.log("No matching record found or the user has already signed out.");
      }
      
        // Check if the user is already on a shift
        console.log("Checking if user is already on a shift...");
        const existingShift = await Attendance.findOne({ userId, sign_out_time: null });

        if (existingShift) {
            console.log("User is already on a shift:", existingShift);
            return res.status(400).json({ message: "User is already on a shift." });
        }

        // Create a new shift
        const newShiftData = {
            userId,
            Lxe_id: find_lxe._id,
            radio_id: find_radio._id,
            location,
            shiftType: currentShift,
            sign_in_time: new Date(),
            shift: "Started",
            sign_out_time: null,
        };

        console.log("Creating new shift with data:", newShiftData);

        const newShift = new Attendance(newShiftData);
        await newShift.save();

        console.log("Shift started successfully:", newShift);

        res.status(200).json({ message: "Shift started successfully.", shift: newShift });
    } catch (error) {
        console.error("Error starting shift:", error);
        res.status(500).json({ message: "Error starting shift.", error });
    }
});


router.get("/check-shift",verifyRefreshToken,async(req,res)=>{
    const userId  = req.user.id;
    try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    let endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    console.log(endOfDay)
    console.log("hello")
    console.log(startOfDay,"fh")

    
        const todayShift = await Attendance.findOne({
            userId,
            sign_in_time: { $gte: startOfDay, $lte: endOfDay }
        });
        console.log(todayShift)

        if (todayShift.sign_out_time === null) {
            res.json( "Shift has started today.");
        } else if(todayShift.sign_out_time !== null) {
            res.status(201).json({ message: "No shift started today." });
        }
    } catch (error) {
        console.log("Error checking today's shift",error)
        res.status(500).json({ message: "Error checking today's shift.", error });
    }
})






router.post("/end-shift", verifyRefreshToken,async (req,res)=>{
const  userId  = req.user.id;

    try {
        // Find the ongoing shift for the user
        const ongoingShift = await Attendance.findOne({ userId, sign_out_time: null });
        if (!ongoingShift) {
            return res.status(400).json({ message: "No ongoing shift found for the user." });
        }

        // End the shift
        ongoingShift.sign_out_time = new Date();
        await ongoingShift.save();

        res.status(200).json({ message: "Shift ended successfully.", shift: ongoingShift });
    } catch (error) {
        res.status(500).json({ message: "Error ending shift.", error });
    }

})

module.exports = router