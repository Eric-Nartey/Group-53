const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const bcrypt = require('bcrypt')
const crypto= require("crypto")
const jwt = require('jsonwebtoken')
const nodemailer= require("nodemailer")
const {rateLimit} = require('express-rate-limit');
const verifyRefreshToken = require('../Middleware/Middleware');
const verifyAdmin = require('../Middleware/Adminware');
require('dotenv').config()


const Limiter= rateLimit({
	windowMs: 10 * 60 * 1000, // 15 minutes
	limit: 20, // Limit each IP to 3 requests per `window` (here, per 5 minutes).
    message: { message: 'Too many attempts, please try again after 10 minutes.' },
    statusCode: 429, // Status code to send when rate limit is exceeded
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	
})

// Create a new user (Worker/Supervisor)
router.post('/signup', async (req, res) => {
  const {fullname,email, password,role,group } = req.body; // Destructure email and password from request body which is sent by the client
   console.log(fullname,email, password,role,group)
  try {

    const user_exist= await User.findOne({email:email})  // Find user by email from the database
    if(user_exist){ // If user already exists, return an error message and exist the function
      res.status(400).json({message:"User already exist"})
      return
    }
    const encryptedPassword= await bcrypt.hash(password,10)  //Encrypt the password using bcrypt
    const newUser = new User({ fullname, email,role,group,password:encryptedPassword });
    await newUser.save(); // Save the new user to the database
    res.status(200).json({message:"Sign up successfull",data:newUser}); // Send a success message to the client
  } catch (error) {
    console.log(error)
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

    const signed= jwt.sign({id:findUser._id,role:findUser.role},process.env.REFRESH_TOKEN,{expiresIn:"1d"}) // Create a new refresh token with a 1-day expiry

    res.cookie('refreshToken', signed, {
      httpOnly: true,   // Ensures that the cookie is only accessible via HTTP(S) requests
      path: '/',        // Specifies the path for which the cookie is valid
      secure: true,          // Indicates that the cookie should only be sent over HTTPS
      sameSite: 'Strict',      // Specifies same-site cookie attribute to prevent cross-site request forgery
      maxAge: 1000 * 60 * 60 * 24
}); // Set the refresh token as a cookie and send to the client browser

if(findUser.role==="Admin"){
    res.status(200).json({message:"supervisor logged in "}) // Return a success message
}else{
    res.status(201).json({message:"Worker logged in "})
}
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
    console.log(error)
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
  return res.status(200).json({ message: "Logged out successfully" });
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






router.get('/me',verifyRefreshToken , async(req,res)=>{
  const userId = req.user.id;
  try{
    const user= await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
     return res.status(200).json(user.fullname)
  }catch(error){
    console.log(error,"me error")
    return res.status(500).json({message:"Error fetching user",error})
  }
})


router.post('/forgot_password', async (req, res) => {
  const { email } = req.body;
  console.log(email)

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpiration = Date.now() + 300000; // Token valid for 1 hour
    await user.save();

    // Send the reset email with the token
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: process.env.EMAIL,//email that will be sending messages from the server to the client
          pass: process.env.PASSWORD  //generated password form less secured apps from Google
      },
      tls: {
          rejectUnauthorized: false, //do not reject self-signed certificates  
        },
    });

    

    const mailOptions = {
      from: '"Do Not Reply" <' + process.env.EMAIL + '>',
      to: email,
      subject: 'Password Reset Request',
      

      html: `
  <div style="text-align: center; font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #333;">Reset Your Password</h2>
    <p style="color: #555;">Click the button below to reset your password:</p>
    <a href="http://localhost:5173/reset-password/${resetToken}" 
       style="background-color: #007bff; color: #fff; padding: 12px 20px; 
              text-decoration: none; border-radius: 5px; display: inline-block;
              font-size: 16px; font-weight: bold;">
      Reset Password
    </a>
    <p style="color: #777; margin-top: 10px;">If you didn’t request a password reset, you can ignore this email.</p>
  </div>
`,
  replyTo: process.env.EMAIL,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
});



router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  console.log({ token, password })

  try {
    // Find the user with the reset token
    const user = await User.findOne({ passwordResetToken: token });

    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired reset token' });
    }

    // Check if the token has expired
    if (Date.now() > user.passwordResetExpiration) {
      return res.status(400).json({ message: 'Reset token has expired' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the user's password
    user.password = hashedPassword;
    user.passwordResetToken = null; // Clear the reset token
    user.passwordResetExpiration = null; // Clear expiration time
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
});

// DELETE /api/users/:id - Delete a user by ID
router.delete("/:id",verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get('/get-all-users',verifyAdmin , async(req,res)=>{
  
  try{
    const users= await User.find({})
    res.json(users)
  }catch(error){
    res.status(500).json({message:"Error fetching users",error})
  }
})

router.get("/get_group", verifyRefreshToken, async (req, res) => {
  const userId = req.user.id;
  const clerk= req.isClerk
 

  try {
    const user = await User.findById(userId) // Select only the group field
    console.log(userId)
    console.log(user)
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: "User not found" }); // Properly end response
    }

    console.log('User group:', user.group);
    return res.status(200).json({ group: user.group,clerk:clerk }); // Better to wrap in an object
  } catch (error) {
    console.error('Error fetching user group:', error);
    
    // Only send error response if headers haven't been sent yet
    
      return res.status(500).json({ message: "Error fetching user group" });
    
  }
});



module.exports = router;
