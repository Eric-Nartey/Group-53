const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['Worker', 'Supervisor'], required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  assigned_crane_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Crane', default: null }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
