const express= require("express");
const requestRouter= express.Router();
const {userAuth}= require("../middleware/auth");

//sendConnection api
requestRouter.post("/sendConnectionRequest", userAuth, (req, res)=>{
    const user= req.user;
    //Sending a connection request
    console.log("Sending a connection request");
    res.send(user.firstName +" sent the connect request");
})

module.exports= requestRouter;