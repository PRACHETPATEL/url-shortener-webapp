const express=require("express");
const {getProfile,registerUser, loginUser} = require("../controller/user");
const router=express.Router();
router.get("/profile",getProfile);
router.post("/register",registerUser);
router.post("/login",loginUser);

module.exports=router;