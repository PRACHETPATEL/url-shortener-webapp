const asyncHandler = require('express-async-handler')
const User = require('../model/user.model')
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const Url = require('../model/url.model');
const getProfile = asyncHandler( async (req, res) => {
  if(req.user===undefined){
    console.log("unauthorized");
    res.status(401);
    res.json({status:401, message: 'Not Authorized!!'});
    return;
  }
  const user=await User.findById(req.user.id);
  // console.log(user);
  res.status(200);
  res.json({status:200, message: 'Fetched User Profile',profile:{username:user.username,fullname:user.fullname,email:user.email,profile:user.profile}})
  return;
});
const registerUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body
  if (!username || !fullname || !email || !password) {
    res.json({status:800, message: 'all fields are compulsory' })
    return;
  }
  const userEmailAvailable = await User.findOne({ email })
  const userUsernameAvailable = await User.findOne({ username })
  if (userUsernameAvailable) {
    res.json({status:801, message: 'Username ALready Exists' })
    return;
  }
  if (userEmailAvailable) {
    res.json({status:802, message: 'Email ALready Exists' })
    return;
  }
  let usernameRegex = /^[a-z]+([._][a-z]+)*$/;
  let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[_@#$])(?=.*\d).{8,}$/;
  if(!usernameRegex.test(username.toLowerCase())&&username.length<6){
    res.json({status:901, message: 'Username Not In Properformat' })
    return;
  }
  if(!emailRegex.test(email)){
    res.json({status:902, message: 'Email Not In Properformat' })
    return;
  }
  if(!passwordRegex.test(password)&&password.length<8){
    res.json({status:903, message: 'Password Not In Properformat' })
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({
    username: username,
    fullname: fullname,
    email: email,
    password: hashedPassword,
    profile:"0.png"
  });
  console.log(user);
  res.json({status:200, message: 'Registered Successfully!!' })
})
const loginUser = asyncHandler(async (req, res) => {
  const { usernameoremail, password } = req.body
  let user =await User.findOne({ username:usernameoremail });
  if (user!=null) {
    if(await bcrypt.compare(password,user.password)){
      const accessToken = jwt.sign({
        user: {
          id:user.id
        },
      },process.env.ACCESS_TOKEN_SECERT,{expiresIn:"1440m"});
      // console.log(accessToken);
      res.cookie('token',accessToken,{ maxAge: 864000000, httpOnly: true });
      res.cookie('logged_in',{"value":"yes"},{ maxAge: 864000000, httpOnly: true  }); 
      const cookieurls=req.cookies.urls;
      if(cookieurls){
        cookieurls.forEach(async(element)=>{
          let check=await Url.findOne({user_id:user.id,url:element.url.url});
          // console.log(check);
          if(!check){
            await Url.findByIdAndUpdate(element.url._id,{user_id:user.id});
          }else{
            await Url.findByIdAndDelete(element.url._id);
          }
        })
      }
      res.clearCookie("urls");
      res.json({status:200,message:"Logged IN Successfully!!"});
      return;
    }else{
      res.json({status:403,message:"Invalid Password!!"});
      return;
    }
  }else{
    user =await User.findOne({ email: usernameoremail })
    if (user!=null) {
      if(await bcrypt.compare(password,user.password)){
        const accessToken = jwt.sign({
          user: {
            id:user.id
          },
        },process.env.ACCESS_TOKEN_SECERT,{expiresIn:"1440m"});
        console.log(accessToken);
        res.cookie('token',accessToken,{ maxAge: 864000000, httpOnly: true  });  
        res.cookie('logged_in',{"value":"yes"},{ maxAge: 864000000, httpOnly: true  });  
        res.json({status:200,message:"Logged IN Successfully!!"});
        return;
      }else{
        res.json({status:403,message:"Invalid Password!!"});
        return;
      }
    }else{
      res.json({status:401,message:"Invalid Email/Username!!"});
      return;
    }
  }
});
const updateProfile=asyncHandler(async (req,res)=>{
  if(req.user===undefined){
    console.log("unauthorized");
    res.status(401);
    res.json({status:401, message: 'Not Authorized!!'});
    return;
  }
  const {name,profile}=req.body;
  const user=await User.findByIdAndUpdate(req.user.id,{fullname:name,profile:profile},{new:true});
  if(user){
    res.json({status:202, message: 'Profile Updated!!'});
    return;
  }
  res.json({status:400, message: 'Profile Not Updated!!' })
})
const resetPassword=asyncHandler(async (req,res)=>{
  if(req.user===undefined){
    console.log("unauthorized");
    res.status(401);
    res.json({status:401, message: 'Not Authorized!!'});
    return;
  }
  const {currentpassword,password,retypepassword}=req.body;
  let passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[_@#$])(?=.*\d).{8,}$/;
  const user=await User.findById(req.user.id);
  if(await bcrypt.compare(currentpassword,user.password)){
    console.log(currentpassword);
    console.log(password);
    console.log(retypepassword);
    if(currentpassword.match(password)){
      res.json({status:400, message: 'Same Password!!' });
      return;
    }
    if(passwordRegex.test(password)&&passwordRegex.test(retypepassword)&&password.match(retypepassword)){
      const hashedPassword = await bcrypt.hash(password, 10)
      await User.findByIdAndUpdate(req.user.id,{password:hashedPassword});
      res.json({status:202, message: 'Password Updated!!' });
      return;
    }else{
      res.json({status:400, message: 'Invalid!!' });
      return;
    }
  }else{
    res.json({status:400, message: 'Invalid Password!!' });
    return
  }
})
module.exports = { getProfile, registerUser, loginUser,updateProfile,resetPassword}