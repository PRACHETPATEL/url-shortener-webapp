const asyncHandler=require("express-async-handler");
const jwt=require("jsonwebtoken");
require("dotenv").config();
const validateToken=asyncHandler(async (req,res,next)=>{
    let token;
    let authstatus=req.cookies.token?true:false;
    // console.log(req.cookies.token);
    // console.log(req.cookies.logged_in);
    if(authstatus){
        console.log("Access Token Being Verified...");
        token=req.cookies.token;
        if(token!==""){
            jwt.verify(token, process.env.ACCESS_TOKEN_SECERT ,(err,decoded)=>{
                if(err){
                    res.status(401);
                    throw new Error("User is not authorized")
                }
                req.user=decoded.user;
                next();
                return;
            });
        }
        return;
    }else{
        next();
        return;
    }
});
module.exports=validateToken;