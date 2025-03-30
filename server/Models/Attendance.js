const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shiftType: {type:String, enum:['Morning','Evening','Off'], required: true},
  shift:{type:String,enum:['Started','Completed']},
  Lxe_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Lxe' },
  radio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Radio', required: true },
  location:{type:String},
  sign_in_time: { type: Date, required: true },
  sign_out_time: { type: Date, default: null }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
