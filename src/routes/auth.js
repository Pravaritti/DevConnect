const express= require("express");
const authRouter= express.Router();

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
        const isPasswordValid= await user.validatePassword(password);
        if(isPasswordValid){
            //create jwt token
            const token= await user.getJWT();
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

module.exports= authRouter;