const express=require("express");
const redirectURL = require("../controller/redirect");
const router=express.Router();
router.route("/:id").get(redirectURL);
module.exports=router;