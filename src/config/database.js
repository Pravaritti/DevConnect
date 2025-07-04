const mongoose= require("mongoose");
const connectDB= async ()=>{
    await mongoose.connect(
        "mongodb+srv://namasteDev:Z6g0ACng90aq7cSI@devconnect.ldep9pz.mongodb.net/DevConnect"
    );
}

module.exports= connectDB;





