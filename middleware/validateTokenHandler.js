const asyncHandler=require("express-async-handler");
const jwt=require("jsonwebtoken");
require("dotenv").config();
const validateToken=asyncHandler(async (req,res,next)=>{
    let token;
    let authstatus=req.cookies.token?true:false;
    // console.log(req.cookies.token);
    if(authstatus){
        console.log("Access Token Being Verified...");
        token=req.cookies.token;
        jwt.verify(token, process.env.ACCESS_TOKEN_SECERT ,(err,decoded)=>{
            if(err){
                res.status(401);
                throw new Error("User is not authorized")
            }
            req.user=decoded.user;
            console.log(req.user.id);
            next();
        });
        if(!token){
            res.status(401);
            throw new Error("User is not authorized or token is missing in request");
        }
    }else{
        next();
    }
});
module.exports=validateToken;