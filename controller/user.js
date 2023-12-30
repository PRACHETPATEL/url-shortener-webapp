const asyncHandler = require('express-async-handler');
const getProfile=asyncHandler(async (req,res)=>{
    res.status(200);
    res.json({message:"Fetched User Profile"});
})
const registerUser=asyncHandler(async (req,res)=>{
    res.status(200);
    res.json({message:"User Registered"});
})
const loginUser=asyncHandler(async (req,res)=>{
    res.status(200);
    res.json({message:"User Authenticated!!"});
})
module.exports={getProfile,registerUser,loginUser};