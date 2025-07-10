const express= require("express");
const profileRouter= express.Router();
const {userAuth}= require("../middleware/auth");
const { validateEditProfile } = require("../utils/validation");

//get profile api using cookie
profileRouter.get("/profile/view", userAuth, async (req, res)=>{
    try{
        const user= req.user;
        console.log(user);
        res.send(user);
    } catch(err){
        res.status(404).send("ERROR: "+err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res)=>{
    try{
        //validate fields
        if(!validateEditProfile(req)){
            throw new Error("Invalid Edit Request");
        }

        //reading user from userAuth middleware
        const loggedInUser= req.user;

        //mapping logged in user's fields to the data sent to edit while making api call
        //basically updating the user fields and setting their values to new ones
        Object.keys(req.body).forEach((key) => (loggedInUser[key]= req.body[key]));

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser,
        });
    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
});

module.exports= profileRouter;