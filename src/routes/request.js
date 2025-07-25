const express= require("express");
const requestRouter= express.Router();

const {userAuth}= require("../middleware/auth");
const ConnectionRequest= require("../models/connectionRequest");
const User= require("../models/user");

//sendConnection api
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res)=>{
    try{
        //user is already there from usreAuth
        const fromUserId= req.user._id;
        const toUserId= req.params.toUserId;
        const status= req.params.status;

        //validate status
        const allowedStatus= ["interested", "ignored"];
        if(!allowedStatus.includes(status)){
            res.status(400).json({
                message: "Invalid status type: "+ status
            });
        }

        //validate if to user even exists in DB:
        const toUser= await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({message: "User not found!!"});
        }

        const existingConnectionRequest= await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId},
            ],
        });
        if(existingConnectionRequest) {
            return res.status(400).json({message: "Connection Request already exists!!"});
        }

        const connectionRequest= new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })

        //save into db
        const data= await connectionRequest.save();

        res.json({
            message: "Connection request status: "+ status,
            data,
        });


    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
    
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res) => {
    try{
        const loggedInUser= req.user;
        const {status, requestId}= req.params;

        //validate status
        const allowedStatus= ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Status not allowed!"});
        }

        //check requestId is present in DB or not
        //toUserId= loggedInUser
        //status= interested
        const connectionRequest= await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });
        if(!connectionRequest) {
            return res.status(404).json({message: "Connection request is not found"});
        }

        connectionRequest.status= status;
        const data= await connectionRequest.save();

        res.json({ message: "Connection Request: "+status, data});

    } catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
});

module.exports= requestRouter;