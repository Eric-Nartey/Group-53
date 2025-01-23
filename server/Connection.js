const mongoose= require("mongoose")

// Connect to MongoDB
const connect= async()=>{
  try{
     return mongoose.connect(process.env.MONGO_URI)
  }catch(e){
    console.log(e)
  }  

}

module.exports = connect