const express=require("express");
const {getProfile,registerUser, loginUser} = require("../controller/user");
const validateToken = require("../middleware/validateTokenHandler");
const router=express.Router();
router.get("/profile",validateToken, getProfile);
router.post("/register",registerUser);
router.post("/login",loginUser);

module.exports=router;