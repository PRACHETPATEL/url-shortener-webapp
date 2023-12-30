const asyncHandler = require('express-async-handler')
const addUrl=asyncHandler(async(req,res)=>{
    res.status(200);
    res.json({message:"Url Added Successfully"});
})
const getUnshortenUrl=asyncHandler(async (req,res)=>{
    res.status(200);
    res.json({message:"Url UnShortened Successfully"});
})
const deleteShortenUrl=asyncHandler(async (req,res)=>{
    res.status(200);
    res.json({message:"deleted Shortened url Successfully"});
})
const updateShortenUrl=asyncHandler(async (req,res)=>{
    res.status(200);
    res.json({message:"updated Shortened url Successfully"});
})
const getAllUrl=asyncHandler(async (req,res)=>{
    res.status(200);
    res.json({message:"All url's fetched  Successfully!!"});
})
module.exports={addUrl,getUnshortenUrl,deleteShortenUrl,updateShortenUrl,getAllUrl};