const userAuth= (req, res, next) => {
    const token= "xyz";
    const isAdminAuthorized= token==="xyz";
    if(!isAdminAuthorized){
        res.status(400).send("Unauthorized request");
    } else {
        next();
    }
};
module.exports= {userAuth};