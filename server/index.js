const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connect= require("./Connection")
const cors = require('cors')
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // For parsing JSON request bodies
app.use(cookieParser()); // For parsing cookies
app.use(cors({
  origin: process.env.REACT_APP_API_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}))




// Import routes
const authRoutes = require('./Routes/AuthRoutes');
const userRoutes = require('./Routes/UserRoutes');
const supervisorRoutes = require('./Routes/SupervisorRoutes');
const attendanceRoutes = require('./Routes/AttendanceRoutes');
const craneRoutes = require('./Routes/CraneRoutes');
const adminRoutes = require('./Routes/AdminRoutes');
const shiftRoutes =require('./Routes/ShiftRoute')

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/supervisors', supervisorRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api/cranes', craneRoutes);
app.use('/api/lxcRadio', adminRoutes);
app.use('/api/shift', shiftRoutes);




// Start the server
async  function start(){
try{
    await connect()
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
}catch(error){
    console.log(error)
}
}
start()
