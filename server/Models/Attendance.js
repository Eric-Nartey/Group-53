const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shift_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift', required: true },
  date: { type: Date, required: true },
  sign_in_time: { type: String, required: true },
  sign_out_time: { type: String, default: null }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
