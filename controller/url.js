const asyncHandler = require('express-async-handler')
const addUrl=asyncHandler(async(req,res)=>{
    res.status(200);
    res.json({message:"Url Added Successfully"});
})
module.exports={addUrl};