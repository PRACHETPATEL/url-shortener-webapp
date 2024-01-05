const express=require("express");
const redirectURL = require("../controller/redirect");
const router=express.Router();
router.route("/client/home").get((req,res)=>{
    res.status(200);
    res.render("index");
})
router.route("/client/unshorten").get((req,res)=>{
    res.status(200);
    res.render("unshortenurl");
})
router.route("/client/dashboard").get((req,res)=>{
    res.status(200);
    res.render("dashboard");
})
router.route("/client/login").get((req,res)=>{
    res.status(200);
    res.render("login");
})
router.route("/client/register").get((req,res)=>{
    res.status(200);
    res.render("register");
})
router.route("/:id").get(redirectURL);
module.exports=router;