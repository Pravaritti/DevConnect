const express= require("express");
const connectDB= require("./config/database");
const {userAuth}= require("./middleware/auth");
const User= require("./models/user");
const {validateSignUpdata}= require("./utils/validation");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app= express();//instance of express.js application


app.use(express.json());
//adding cookie, jwt middleware
app.use(cookieParser());


connectDB()
  .then(() => {
    console.log("DB connection established...");
    app.listen(3000, ()=>{
        console.log("server is succesfully listening on port 3000...");
    })
  })
  .catch(() => {
    console.error("DB cannot be connected");
  });

