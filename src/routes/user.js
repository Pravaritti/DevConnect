const express= require("express");
const { userAuth } = require("../middleware/auth");
const userRouter= express.Router();

userRouter.get("/user/requests", userAuth, async (req, res)=>{
    try{
        const loggedInUser= req.user;

    }catch(err){
        res.status(400).send("ERROR: "+message);
    }


})

module.exports= userRouter;