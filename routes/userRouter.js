const express=require("express");
const getProfile = require("../controller/user");
const router=express.Router();
router.route("/profile").get(getProfile);

module.exports=router;