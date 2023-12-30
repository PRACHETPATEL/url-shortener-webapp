const express=require("express");
const { addUrl,getUnshortenUrl,deleteShortenUrl, updateShortenUrl, getAllUrl} = require("../controller/url");
const router=express.Router();
router.post("/shorten",addUrl);
router.get("/",getAllUrl);
router.post("/unshorten",getUnshortenUrl);
router.delete("/:id",deleteShortenUrl);
router.put("/:id",updateShortenUrl);

module.exports=router;