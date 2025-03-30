const {Schema,model} = require('mongoose')

const radioSchema = new Schema({
  radio_number: { type: String, required: true },
  

});


 const LxeSchema = new Schema({
 lxe_number: {type: String},

});
const Lxe = model('Lxe', LxeSchema);
const Radio = model('Radio', radioSchema);

module.exports = {Lxe, Radio}