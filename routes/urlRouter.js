const express=require("express");
const { addUrl,getUnshortenUrl,deleteShortenUrl, updateShortenUrl, getAllUrl, deleteGuestCookie} = require("../controller/url");
const validateToken = require("../middleware/validateTokenHandler");
const router=express.Router();
router.post("/shorten",validateToken, addUrl);
router.get("/",validateToken,getAllUrl);
router.post("/unshorten",getUnshortenUrl);
router.delete("/:id",validateToken,deleteShortenUrl);
router.delete("/guest/:id",deleteGuestCookie);
router.put("/:id",validateToken,updateShortenUrl);

module.exports=router;