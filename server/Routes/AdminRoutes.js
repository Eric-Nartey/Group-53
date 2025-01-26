const express = require('express');
const { Lxc, Radio } = require('../Models/Radio&Lxc');
const verifyAdmin = require('../Middleware/Adminware');

const router = express.Router();

// Route to add a new LXC
router.post('/post-lxc',verifyAdmin, async(req, res) => {
    const {lxcNumber} = req.body;
    console.log(lxcNumber)
    try{
      const findLxc= await Lxc.findOne({lxc_number:lxcNumber})
      if(findLxc) return res.status(400).json({message:"LXC already exist"})
      const LxcNumber= await Lxc.insertMany({lxc_number:lxcNumber}) 
    res.status(201).send({ message: 'New LXC added successfully', data: LxcNumber });

    }catch(error){
        res.status(500).json({message:"Failed to add LXC",error})
    }
    
});



// Route to add a new Radio
router.post('/post-radio',verifyAdmin,async (req, res) => {
    const {radioNumber} = req.body;
    console.log(newRadio)
    try{
        const findRadio= await Radio.findOne({lxc_number:lxcNumber})
      if(findRadio) return res.status(400).json({message:"Radio already exist"})
        const RadioNumber= await Radio.insertMany(radioNumber) 
    res.status(201).send({ message: 'New Radio added successfully', data: RadioNumber });
    }catch(error){
        res.status(500).json({message:"Failed to add Radio",error}) 
    }

});


router.get('/get-lxcs',verifyAdmin, async(req, res) => {
    
    try{

      const lxcNumber= await Lxc.find({}) 
    res.json(lxcNumber);

    }catch(error){
        res.status(500).json({message:"Failed to add LXC",error})
    }
    
});

router.get('/get-radios',verifyAdmin, async(req, res) => {
    
    try{

      const radioNumber= await Radio.find({}) 
      res.json(radioNumber);

    }catch(error){
        res.status(500).json({message:"Failed to add LXC",error})
    }
    
});

module.exports = router;