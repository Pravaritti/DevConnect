const express= require("express");
const profileRouter= express.Router();

//get profile api using cookie
app.get("/profile", userAuth, async (req, res)=>{
    try{
        const user= req.user;
        console.log(user);
        res.send(user);
    } catch(err){
        res.status(404).send("ERROR: "+err.message);
    }
});

module.exports= profileRouter;