const express= require("express");
const authRouter= express.Router();

const {validateSignUpdata}= require("../utils/validation");
const User= require("../models/user");
const bcrypt= require("bcrypt");

//signup api
authRouter.post("/signup", async (req, res) => {
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
        const savedUser= await user.save(); //returns a promise

        const token= await savedUser.getJWT();
        res.cookie("token", token, {
            expires: new Date(Date.now()+ 8*3600000),
        });

        res.json({message: "User Added successfully!", data: savedUser})
    } catch(err) {
        //res.status(400).send("Error saving the user: "+ err.message);
        res.status(500).send("Error: " + err.message);
    }

});

//login api
authRouter.post("/login", async (req, res)=>{
    try{
        const {emailId, password}= req.body;

        const user= await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid= await user.validatePassword(password);
        if(isPasswordValid){
            //create jwt token
            const token= await user.getJWT();
            //Add the token to the cookie and send the response back to the user
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8*3600000),
            }); //sends this token back to user
            res.send(user);
        } else{
            throw new Error("Invalid credentials");
        }
    }catch(err){
        res.status(404).send("ERROR: "+ err.message);
    }
});

authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("User Logged out");
})

module.exports= authRouter;