const express=require("express");
const {getProfile,registerUser, loginUser, updateProfile,resetPassword} = require("../controller/user");
const validateToken = require("../middleware/validateTokenHandler");
const router=express.Router();
router.get("/profile",validateToken, getProfile);
router.put("/profile",validateToken, updateProfile);
router.post("/register",registerUser);
router.post("/resetpassword",validateToken,resetPassword);
router.post("/login",loginUser);
router.get("/logout",(req,res)=>{
    res.clearCookie('token');
    res.clearCookie('logged_in')
    const url = `${req.protocol}://${req.get('host')}/client/home`
    res.redirect(url);
});
router.get("/getloginstatus",validateToken,(req,res)=>{
    const logged_in=req.cookies.logged_in?true:false;
    if(logged_in){
        res.json({status:200,message:"User Logged In",user_id:req.user.id});
        return;
    }
    res.json({status:403,message:"User Not Logged In"});
});
module.exports=router;