const express=require("express");
const redirectURL = require("../controller/redirect");
const validateToken = require("../middleware/validateTokenHandler");
const { getStats } = require("../controller/url");
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
router.route("/client/profile").get((req,res)=>{
    res.status(200);
    res.render("profile");
})

router.get("/client/stats/:id",validateToken,(req,res)=>{
    if(req.user===undefined){
      res.redirect('/client/dashboard');
      return;
    }
    res.render("stats",{id:req.params.id});
  });

router.route("/:id").get(redirectURL);
router.route("/").get((req,res)=>{
    res.redirect("/client/home");
});
module.exports=router;