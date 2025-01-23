const mongoose = require('mongoose');

const craneSchema = new mongoose.Schema({
  crane_name: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  supervisor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor', required: true }
});

const Crane = mongoose.model('Crane', craneSchema);
module.exports = Crane;
