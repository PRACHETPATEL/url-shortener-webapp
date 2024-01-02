const asyncHandler = require('express-async-handler')
const Url = require('../model/url.model')
const { default: mongoose } = require('mongoose');
const { updateShortenUrl } = require('./url');
const UrlMetadata = require('../model/urlmetadata.model');
const { generateDate } = require('../utilities/getDate');
const redirectURL=asyncHandler(async(req,res)=>{
    const url=`${req.protocol}://${req.get('host')}/${req.params.id}`;
    const check=await Url.findOne({shortened_url:url});
    let date=generateDate();
    if(check){
        const checkmetadata= await UrlMetadata.find({url_id:check.id});
        if(checkmetadata!=null && checkmetadata.length>=1){
            const urldata=checkmetadata[checkmetadata.length-1];
            let date1 = new Date(date);
            let date2 = new Date(urldata.date);
            let formattedDate1 = date1.toISOString().split('T')[0];
            let formattedDate2 = date2.toISOString().split('T')[0];
            if (formattedDate1 === formattedDate2) {
                const visits=urldata.visitsperday+1;
                const update=await UrlMetadata.findByIdAndUpdate(urldata.id,{visitsperday:(visits)});
            } else if (formattedDate1 > formattedDate2) {
                const data=await UrlMetadata.create({
                    url_id:check.id,
                    visitsperday:1,
                    date:date
                })
            }
        }else{
            const data=await UrlMetadata.create({
                url_id:check.id,
                visitsperday:1,
                date:date
            })
        }
        const visits=check.visits+1;
        const data=await Url.findByIdAndUpdate(check.id,{visits:(visits)});
        res.redirect(check.url);
        res.status(200);
        return;
    }
    res.redirect("/client/home");
});
module.exports=redirectURL;