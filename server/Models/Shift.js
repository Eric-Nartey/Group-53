const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  shift_name: { type: String, enum: ['Morning', 'Afternoon', 'Evening'], required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true }
});

const Shift = mongoose.model('Shift', shiftSchema);
module.exports = Shift;
