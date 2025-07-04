const mongoose= require("mongoose");
const userSchema= new mongoose.Schema({
    firstName: {
        type: String,
        required: true, //mandatory field
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowerCase: true,
        unique: true,
        trim: true,
    },
    age: {
        type: Number,
        min:18,
    },
    gender: {
        type: String,
        validate(value){
            //custom validations
            if(!["male", "female", "others"]){
                throw new Error("Gender data is not valid!!");
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user!",
    },
    skills: {
        type: [String],
    }
},
{
    timestamps: true,
});
module.exports= mongoose.model("User", userSchema);