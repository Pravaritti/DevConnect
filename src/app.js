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

//signup api
app.post("/signup", async (req, res) => {
    // const userObj= {
    //     firstName: "Pravaritti",
    //     lastName: "Kaushik",
    //     emailId: "pravaritti.1995@gmail.com",
    //     age: 29
    // }
    //creating instance of our model to save this data into model
    //const user= new User(userObj);

    //Validate data
    validateSignUpdata(req);
    const {firstName, lastName, emailId, password}= req.body;

    //Encrypt the password
    //const {password}= req.body;
    const passwordHash= await bcrypt.hash(password, 10);
    const user= new User({
        firstName, lastName, emailId, password: passwordHash,
    });
    try{
        await user.save(); //returns a promise
        res.send("User added auccessfully!!")
    } catch(err) {
        //res.status(400).send("Error saving the user: "+ err.message);
        res.status(500).send("Error: " + err.message);
    }

})

//login api
app.post("/login", async (req, res)=>{
    try{
        const {emailId, password}= req.body;

        const user= await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid= await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            //create jwt token
            const token= await jwt.sign({_id: user._id}, "password_only_known_to_server", {expiresIn: "1d"});
            //Add the token to the cookie and send the response back to the user
            res.cookie("token", token); //sends this token back to user
            res.send("Login Successful")
        } else{
            throw new Error("Invalid credentials");
        }
    }catch(err){
        res.status(404).send("ERROR: "+ err.message);
    }
})

//get profile api using cookie
app.get("/profile", userAuth, async (req, res)=>{
    try{
        const user= req.user;
        console.log(user);
        res.send(user);
    } catch(err){
        res.status(404).send("ERROR: "+err.message);
    }
})

//sendConnection api
//app.get("/sendConnectionRequest")

//validate password
/////////??????????????????????????????////////////////////////////////////////////
app.post("/user", async (req,res)=>{
    try{
        const {emailId, password}= req.body;
        const user= await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid= await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            //create jwt token
            const token= await jwt.sign({_id: user_id}, "password_only_known_to_server", {expiresIn: "1d"});
            //Add the token to the cookie and send the response back to the user
            res.cookie("token", token); //sends this token back to user
        } else{
            throw new Error("Invalid credentials");
        }
    }catch(err){
        res.status(404).send("ERROR: "+ err.message);
    }
})

//get all users from db
app.get("/user", async(req, res) => {
    const userName= req.body.firstName;
    try{
        const users= await User.find({firstName: userName});
        //if no user
        if(users.length===0){
            res.status(404).send("User not found");
        }else {
            res.send(users);
        }
    } catch(err){
        res.status(404).send("Error saving the user: "+ err.message);
    }
})

//delete api
app.delete("/user/:userId", async(req,res)=>{
    const userId= req.params?.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
        return res.status(404).send("User not found");
        }
        res.send("User deleted successfully!!");
    } catch(err){
        res.status(404).send("Error deleting the user: "+ err.message);
    }
})

//update the data
app.patch("/user/:userId", async(req, res)=>{
    const userId= req.params?.userId;
    const data= req.body;
    try {
        const ALLOWED_UPDATES= ["emailId", "about", "gender", "age", "skills", "password"];
        const isUpdateAllowed= Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Update not Allowed!!");
        }
        if(data?.skills?.length>10){
            throw new Error("Skills cannot be more than 10");
        }
        await User.findByIdAndUpdate({_id: userId}, data, {
            //options for sanitisation
            returnDocument: "after",
            runValidators: true,
        });
        res.send("Data updated successfully!!");
    } catch(err){
        res.status(404).send("Error updating the user: "+ err.message);
    }
})

//to find all users
app.get("/feed", async(req,res)=> {
    try {
        const users= await User.find({});
        res.send(users);
    } catch(err){
        res.status(404).send("Error saving the user: "+ err.message);
    }
})









//handling a request
app.use("/test", (req, res)=>{
    console.log(req.query);
    res.send("Hello from server!!");
})

//no authorization required for login
app.post("/user/login", (req, res)=>{
    res.send("User logged in Successfully!");
})

// app.get("/user", userAuth, (req,res)=>{
//     console.log("User data sent")
// })

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

  /**
   * 
    try {
        
    } catch(err){
        res.status(404).send("Error saving the user: "+ err.message);
    }
   */

