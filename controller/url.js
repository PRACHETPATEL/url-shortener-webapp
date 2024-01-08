const asyncHandler = require('express-async-handler')
const Url = require('../model/url.model')
const { default: mongoose } = require('mongoose')
const nextCombination = require('../utilities/nextString')
const UrlMetadata = require('../model/urlmetadata.model')
const UrlStatistic = require('../model/urlstatistic.model')

const addUrl = asyncHandler(async (req, res) => {
  const { url } = req.body
  if (!url) {
    res.json({ status: 400, message: 'URL Required!!' })
    return
  }
  
  let urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/
  let shortenedurl = `${req.protocol}://${req.get('host')}/`
  let urlobj = new Object()
  const check = await Url.findOne({ shortened_url: url })
  if (check || url.includes(`${req.protocol}://${req.get('host')}/`) || url.includes(`https://${req.get('host')}/`)) {
    res.status(400)
    res.json({ status: 400, message: 'Url Cannot Be Shortened' })
    return
  }
  try {
    const urls = await Url.find()
    if (urls.length >= 1 && urlRegex.test(url)) {
      const lasturl = urls[urls.length - 1]
      const code = lasturl.shortened_code_string
      const shortenedcodestring = nextCombination(code)
      let urlcookie=req.cookies.urls;
      if (req.user === undefined) {
        if(urlcookie && urlcookie.length>=3){
          res.status(400);
          res.json({status:400,message:"Please Login <br> To shorten and <br> manage more urls"});
          return;
        }
        if(urlcookie){
          let check=false;
          urlcookie.forEach(element=>{
            if(element.url.url===url){
              check=true;
            }
          });
          if(check){
            res.status(400);
            res.json({ status: 400, message: 'Url Already Shortened' })
            return;
          }
        }
        urlobj = await Url.create({
          user_id: new mongoose.Types.ObjectId('5f6a6b7c8d9e1f2a3b4c5d6e'),
          url: url,
          shortened_code_string: shortenedcodestring,
          shortened_url: shortenedurl + shortenedcodestring,
          visits: 0
        })
        // console.log(req.cookies.url);
        if(req.cookies.urls===undefined){
          res.cookie('urls',[{url:urlobj}],{ maxAge: 864000000});
        }else{
          urlcookie[urlcookie.length]={url:urlobj};
          res.cookie('urls',urlcookie,{ maxAge: 864000000});
        }
      } else {
        const checklongurl=await Url.findOne({user_id:req.user.id,url:url});
        if(checklongurl){
          res.status(400);
          res.json({ status: 400, message: 'Url Already Shortened' })
          return;
        }
        urlobj = await Url.create({
          user_id: req.user.id,
          url: url,
          shortened_code_string: shortenedcodestring,
          shortened_url: shortenedurl + shortenedcodestring,
          visits: 0
        })
      }
      res.status(201)
      res.json({ message: 'URL Shortened', url: urlcookie })
      return
    } else if (urls.length == 0 && urlRegex.test(url)) {
      if (req.user === undefined) {
        urlobj = await Url.create({
          user_id: new mongoose.Types.ObjectId('5f6a6b7c8d9e1f2a3b4c5d6e'),
          url: url,
          shortened_code_string: 'aaaaa',
          shortened_url: shortenedurl + 'aaaaa',
          visits: 0
        })
        res.cookie('urls',[{url:urlobj}],{ maxAge: 864000000});
      } else {
        urlobj = await Url.create({
          user_id: req.user.id,
          url: url,
          shortened_code_string: 'aaaaa',
          shortened_code_numericstring: '0.0.0.0.0',
          shortened_url: shortenedurl + 'aaaaa',
          visits: 0
        })
      }
      res.status(201)
      res.json({ message: 'URL Shortened', urls: urlobj });
      return
    } else {
      res.status(400)
      res.json({status:400, message: 'URL Format Not valid' })
      return
    }
  } catch (err) {
    console.log(err)
  }
})
const getUnshortenUrl = asyncHandler(async (req, res) => {
  const { shorturl } = req.body
  const urlobj = await Url.findOne({ shortened_url: shorturl })
  if (urlobj) {
    res.json({ status: 200, message: 'URL Unshortened', url: urlobj.url,visits:urlobj.visits })
    return
  }
  res.json({ status: 808, message: 'URL NOT FOUND' })
})
const deleteShortenUrl = asyncHandler(async (req, res) => {
  if (req.user === undefined) {
    res.status(401)
    res.json({ message: 'Unauthorized' })
    return
  }
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    // console.log("valid");
    const urls = await Url.findByIdAndDelete(req.params.id);
    await UrlMetadata.deleteMany({url_id:req.params.id});
    await UrlStatistic.deleteMany({url_id:req.params.id});
    if (urls != null) {

      res.json({status:201, message: "URL's Deleted Successfully!!", urls: urls })
      return
    }
  }
  res.json({status:404, message: 'URL Not Found!!' })
})
const updateShortenUrl = asyncHandler(async (req, res) => {
  if (req.user === undefined) {
    res.status(401)
    res.json({ message: 'Unauthorized' })
    return
  }
  const { url } = req.body
  let urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/
  const check = await Url.findOne({ shortened_url: url });
  if (check || url.includes(`${req.protocol}://${req.get('host')}/`) || url.includes(`https://${req.get('host')}/`)) {
    // console.log(check)
    res.json({ status: 400, message: 'Url Already Shortened' })
    return
  }
  if (mongoose.Types.ObjectId.isValid(req.params.id) && urlRegex.test(url)) {
    let check=await Url.findOne({user_id:req.user.id,url:url});
    if(check){
      res.json({status:400, message: 'Same URL Exists!!' });
      return;
    }
    const updatedurl = await Url.findByIdAndUpdate(
      req.params.id,
      { url: url },
      {
        new: true
      }
    );
    if (updatedurl != null) {
      await UrlMetadata.deleteMany({url_id:req.params.id});
      await UrlStatistic.deleteMany({url_id:req.params.id});
      res.json({
        status:202,
        message: "URL's Updated Successfully!!"
      })
      return;
    }
  }
  res.json({status:400, message: 'Not URL!!' })
})
const getAllUrl = asyncHandler(async (req, res) => {
  if (req.user !== undefined) {
    const urls = await Url.find({ user_id: req.user.id })
    // console.log(urls)
    res.status(200)
    res.json({ message: "URL's Fetched Successfully!!", urls: urls })
    return;
  }else if(req.cookies.urls){
    res.json({ message: "URL's Fetched Successfully!!", urls: req.cookies.urls })
    return;
  }
  res.json({status:404, message: "No URL's Found!!"})
    return;
});
const deleteGuestCookie=async (req,res)=>{
  if(req.cookies.urls!==undefined){
    let urls=req.cookies.urls;
    // console.log(urls,req.params.id,urls.length);
    if(req.params.id<urls.length){
      
      // console.log(urls[req.params.id].url._id);
      await Url.findByIdAndDelete(urls[req.params.id].url._id);
      await UrlMetadata.deleteMany({url_id:urls[req.params.id].url._id});
      await UrlStatistic.deleteMany({url_id:urls[req.params.id].url._id});
      urls.splice(req.params.id,1)
      // console.log(urls);
      res.cookie("urls",urls,{maxAge:864000000});  
      res.json({status:201,message:"shortened url deleted!!"})
      return;
    }
  };
  res.json({status:400,message:"no url was found!!"})
}
const getStats=(req,res)=>{
  if(req.user.id===undefined){
    res.json({status:401,message:"Not Authorized!!"});
    return;
  }
}
module.exports = {
  addUrl,
  getUnshortenUrl,
  deleteShortenUrl,
  updateShortenUrl,
  getAllUrl,
  deleteGuestCookie,
  getStats
}