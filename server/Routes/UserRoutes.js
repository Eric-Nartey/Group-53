const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {rateLimit} = require('express-rate-limit');
const verifyRefreshToken = require('../Middleware/Middleware');
require('dotenv').config()


const Limiter= rateLimit({
	windowMs: 10 * 60 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 3 requests per `window` (here, per 5 minutes).
    message: { message: 'Too many attempts, please try again after 10 minutes.' },
    statusCode: 429, // Status code to send when rate limit is exceeded
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	
})

// Create a new user (Worker/Supervisor)
router.post('/signup',Limiter ,async (req, res) => {
  const {fullname,email, password,role } = req.body.formData; // Destructure email and password from request body which is sent by the client
   console.log(fullname)
  try {

    const user_exist= await User.findOne({email:email})  // Find user by email from the database
    if(user_exist){ // If user already exists, return an error message and exist the function
      res.status(400).json({message:"User already exist"})
      return
    }
    const encryptedPassword= await bcrypt.hash(password,10)  //Encrypt the password using bcrypt
    const newUser = new User({ fullname, email,role,password:encryptedPassword });
    await newUser.save(); // Save the new user to the database
    res.status(200).json({message:"Sign up successfull"}); // Send a success message to the client
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});


router.post('/login', Limiter,async (req, res) => {
  const { email, password } = req.body;  // Destructure email and password from request body which is sent by the client
  
  try {
    const findUser= await User.findOne({email:email}) // Find user by email from the database
    if(!findUser){ // If user not found, return an error message and exit the function
       res.status(404).json({message:"User not found"})
       return
    }
    const isMatch= await bcrypt.compare(password,findUser.password) // Compare the password sent by the client with the encrypted password stored in the database
    if(!isMatch){  // if the password doesn't match, return an error message and exit the function
     return res.status(400).json({message:"Invalid credentials"})
    }

    const signed= jwt.sign({id:findUser._id},process.env.REFRESH_TOKEN,{expiresIn:"1d"}) // Create a new refresh token with a 1-day expiry

    res.cookie('refreshToken', signed, {
      httpOnly: true,   // Ensures that the cookie is only accessible via HTTP(S) requests
      path: '/',        // Specifies the path for which the cookie is valid
      secure: true,          // Indicates that the cookie should only be sent over HTTPS
      sameSite: 'Strict',      // Specifies same-site cookie attribute to prevent cross-site request forgery
      maxAge: 1000 * 60 * 60 * 24
}); // Set the refresh token as a cookie and send to the client browser
    res.status(200).json({message:"User logged in"}) // Return a success message
  
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


router.post("/logout",async(req,res)=>{
   res.clearCookie("refreshToken").json({message:"User logged out"}) 
})

router.get('/me',verifyRefreshToken, async(req,res)=>{
  const userId = req.user.id;
  try{
    const user= await User.findById(userId)
    res.json(user.fullname)
  }catch(error){
    res.status(500).json({message:"Error fetching user",error})
  }
})

module.exports = router;
