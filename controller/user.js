const asyncHandler = require('express-async-handler')
const User = require('../model/user.model')
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const getProfile = asyncHandler(async (req, res) => {
  if(req.user===undefined){
    res.status(401);
    res.json({ message: 'Not Authorized!!'});
    res.end();
    return;
  }
  const user=await User.findById(req.user.id);
  res.status(200)
  res.json({ message: 'Fetched User Profile',profile:{username:user.username,fullname:user.fullname,email:user.email}})
})
const registerUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body
  if (!username || !fullname || !email || !password) {
    res.json({ message: 'all fields are compulsory' })
    return;
  }
  const userEmailAvailable = await User.findOne({ email })
  const userUsernameAvailable = await User.findOne({ username })
  if (userUsernameAvailable) {
    res.json({ message: 'Username ALready Exists' })
    return
  }
  if (userEmailAvailable) {
    res.json({ message: 'Email ALready Exists' })
    return
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({
    username: username,
    fullname: fullname,
    email: email,
    password: hashedPassword
  })
  console.log(user);
  res.status(200)
  res.json({ message: 'Registered Successfully!!' })
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
      res.json({status:200,message:"success!!"});
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
        res.json({status:200,message:"success!!"});
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