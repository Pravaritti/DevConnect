const express= require("express");

//instance of express.js application
const app= express();

//handling a request
app.use("/test", (req, res)=>{
    res.send("Hello from server!!");
})

app.listen(3000, ()=>{
    console.log("server is succesfully listening on port 3000...")
})