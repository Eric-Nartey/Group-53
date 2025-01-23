const mongoose = require('mongoose');
const User = require('./User');

const supervisorSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assigned_radio: { type: String, required: true, unique: true }
});

const Supervisor = mongoose.model('Supervisor', supervisorSchema);
module.exports = Supervisor;
