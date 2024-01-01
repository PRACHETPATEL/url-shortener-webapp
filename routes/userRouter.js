const express=require("express");
const {getProfile,registerUser, loginUser} = require("../controller/user");
const validateToken = require("../middleware/validateTokenHandler");
const router=express.Router();
router.get("/profile",validateToken, getProfile);
router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout",(req,res)=>{
    res.clearCookie('token');
    res.json({message:"User Logged Out"})
});
module.exports=router;