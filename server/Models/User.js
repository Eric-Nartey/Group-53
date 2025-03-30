const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  role: { type: String, enum: ['Admin','Worker', 'Supervisor','Foreman','Clerk','Lasher'], required: true },
  email: { type: String, required: true, unique: true },
  group:{type:String,enum:['Group A','Group B','Group C'],required:true},
  password: { type: String, required: true },
  passwordResetToken:{type:String,default:null},
  passwordResetExpiration:{type:Date ,default:null}
});

const User = mongoose.model('User', userSchema);
module.exports = User;
