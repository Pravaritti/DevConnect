const express= require("express");
const connectDB= require("./config/database");
const cookieParser = require("cookie-parser");
const app= express();//instance of express.js application
const cors= require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
//adding cookie, jwt middleware
app.use(cookieParser());

const authRouter= require("./routes/auth");
const profileRouter= require("./routes/profile");
const requestRouter= require("./routes/request");
const userRouter= require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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

