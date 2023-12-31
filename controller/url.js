const asyncHandler = require('express-async-handler');
const Url = require('../model/url.model');
const { default: mongoose } = require('mongoose');
const nextCombination = require('../utilities/nextString');
const addUrl=asyncHandler(async(req,res)=>{
    const {url}=req.body;
    let urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
    const urls=await Url.find();
    let shortenedurl=`${req.protocol}://${req.get('host')}/`;
    let urlobj=new Object();
    try{
        if(urls.length>=1&&urlRegex.test(url)){
            const lasturl=urls[urls.length-1];
            const code=lasturl.shortened_code_string;
            const shortenedcodestring = nextCombination(code);    
            if(req.user===undefined){
                urlobj=await Url.create({
                    user_id:new mongoose.Types.ObjectId("5f6a6b7c8d9e1f2a3b4c5d6e"),
                    url:url,
                    shortened_code_string:shortenedcodestring,
                    shortened_url:shortenedurl,
                    visits:0
                });
            }else{
                urlobj=await Url.create({
                    user_id:req.user.id,
                    url:url,
                    shortened_code_string:shortenedcodestring,
                    shortened_url:shortenedurl,
                    visits:0
                })
            }
            res.status(201);
            res.json({message:"URL Shortned",url:urlobj});
    
        }else if(urls.length==0&&urlRegex.test(url)){
            if(req.user===undefined){
                urlobj=await Url.create({
                    user_id:new mongoose.Types.ObjectId("5f6a6b7c8d9e1f2a3b4c5d6e"),
                    url:url,
                    shortened_code_string:"aaaaa",
                    shortened_url:shortenedurl+"aaaaa",
                    visits:0
                });
            }else{
                urlobj=await Url.create({
                    user_id:req.user.id,
                    url:url,
                    shortened_code_string:"aaaaa",
                    shortened_code_numericstring:"0.0.0.0.0",
                    shortened_url:shortenedurl+"aaaaa",
                    visits:0
                })
            }
            res.status(201);
            res.json({message:"URL Shortned",url:urlobj});
        }else{
            res.status(200);
            res.json({message:"URL Format Not valid"});
        }
    }catch(err){
        console.log(err);
    }
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