const asyncHandler = require('express-async-handler')
const User = require('../model/user.model')
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const getProfile = asyncHandler( async (req, res) => {
  if(req.user===undefined){
    console.log("unauthorized");
    res.status(401);
    res.json({status:401, message: 'Not Authorized!!'});
    return;
  }
  const user=await User.findById(req.user.id);
  console.log(user);
  res.status(200);
  res.json({status:200, message: 'Fetched User Profile',profile:{username:user.username,fullname:user.fullname,email:user.email}})
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
    password: hashedPassword
  })
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
      console.log(accessToken);
      res.cookie('token',accessToken,{ maxAge: 1440000, httpOnly: true, secure: true, sameSite: 'none'  });
      res.cookie('logged_in',{"value":"yes"},{ maxAge: 1440000 }); 
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
        res.cookie('token',accessToken,{ maxAge: 1440000, httpOnly: true, secure: false, sameSite: 'none'  });  
        res.cookie('logged_in',{"value":"yes"},{ maxAge: 1440000 });  
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
module.exports = { getProfile, registerUser, loginUser }