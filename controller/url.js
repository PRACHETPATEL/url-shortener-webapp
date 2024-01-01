const asyncHandler = require('express-async-handler')
const Url = require('../model/url.model')
const { default: mongoose } = require('mongoose')
const nextCombination = require('../utilities/nextString')

const addUrl = asyncHandler(async (req, res) => {
  const { url } = req.body
  let urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/
  const urls = await Url.find()
  let shortenedurl = `${req.protocol}://${req.get('host')}/`
  let urlobj = new Object()
  const check = await Url.findOne({ shortened_url: url })
  if (check || url.includes(`${req.protocol}://${req.get('host')}/`)) {
    console.log(check)
    res.json({ status: 400, message: 'Url Already Shortened' })
    return
  }
  try {
    if (urls.length >= 1 && urlRegex.test(url)) {
      const lasturl = urls[urls.length - 1]
      const code = lasturl.shortened_code_string
      const shortenedcodestring = nextCombination(code);
      console.log(req.user);
      if (req.user === undefined) {
        urlobj = await Url.create({
          user_id: new mongoose.Types.ObjectId('5f6a6b7c8d9e1f2a3b4c5d6e'),
          url: url,
          shortened_code_string: shortenedcodestring,
          shortened_url: shortenedurl + shortenedcodestring,
          visits: 0
        })
      } else {
        urlobj = await Url.create({
          user_id: req.user.id,
          url: url,
          shortened_code_string: shortenedcodestring,
          shortened_url: shortenedurl + shortenedcodestring,
          visits: 0
        })
      }
      res.status(201)
      res.json({ message: 'URL Shortned', url: urlobj })
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
      res.json({ message: 'URL Shortned', url: urlobj })
      return
    } else {
      res.status(200)
      res.json({ message: 'URL Format Not valid' })
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
    res.json({ message: 'URL Unshortened', url: urlobj.url })
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
    const urls = await Url.findByIdAndDelete(req.params.id)
    if (urls != null) {
        res.status(202)
        res.json({ message: "URL's Deleted Successfully!!", urls: urls })
        return
    }
  }
  res.status(202)
  res.json({ message: 'URL Not Found!!' })
 
})
const updateShortenUrl = asyncHandler(async (req, res) => {
  if(req.user===undefined){
      res.status(401);
      res.json({message:"Unauthorized"})
      return;
  }
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    const updatedurl = await Url.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    if (updatedurl != null) {
      res.status(202)
      res.json({
        message: "URL's Updated Successfully!!",
        urls: updatedurl
      })
      return;
    }
  }
  res.status(202)
  res.json({ message: 'URL Not Found!!' })
})
const getAllUrl = asyncHandler(async (req, res) => {
  if (req.user === undefined) {
    res.status(401)
    res.json({ message: 'Unauthorized' })
    return
  }
  const urls = await Url.find({ user_id: req.user.id })
  console.log(urls);
  res.status(200)
  res.json({ message: "URL's Fetched Successfully!!", urls: urls })
  return
})
module.exports = {
  addUrl,
  getUnshortenUrl,
  deleteShortenUrl,
  updateShortenUrl,
  getAllUrl
}
