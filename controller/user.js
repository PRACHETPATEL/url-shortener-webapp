const asyncHandler = require('express-async-handler');
const getProfile=asyncHandler(async (req,res)=>{
    res.status(200);
    res.json({message:"Fetched User Profile"});
})
module.exports=getProfile;