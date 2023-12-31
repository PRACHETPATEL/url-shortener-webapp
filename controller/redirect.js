const asyncHandler = require('express-async-handler')
const Url = require('../model/url.model')
const { default: mongoose } = require('mongoose')
const redirectURL=asyncHandler(async(req,res)=>{
    const url=`${req.protocol}://${req.get('host')}/${req.params.id}`;
    const check=await Url.findOne({shortened_url:url});
    if(check){
        res.redirect(check.url);
        return;
    }
    res.redirect("/");
})
module.exports=redirectURL;