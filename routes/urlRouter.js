const express=require("express");
const { addUrl } = require("../controller/url");
const router=express.Router();
router.route("/shorten").post(addUrl);

module.exports=router;