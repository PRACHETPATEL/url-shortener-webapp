const express=require("express");
const redirectURL = require("../controller/redirect");
const router=express.Router();
router.route("/client/home").get((req,res)=>{
    res.status(200);
    res.render("index");
})
router.route("/:id").get(redirectURL);
module.exports=router;