const {Schema,model} = require('mongoose')

const radioSchema = new Schema({
  radio_number: { type: String, required: true },
  

});


 const LxcSchema = new Schema({
 lxc_number: {type: String},

});
const Lxc = model('Lxc', LxcSchema);
const Radio = model('Radio', radioSchema);

module.exports = {Lxc, Radio}