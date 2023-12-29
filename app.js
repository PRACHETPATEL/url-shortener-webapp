const express=require("express");
const app=express();
require("dotenv").config()
const logger=require("morgan");

app.use(express.json());
app.use(logger("combined"))

app.listen(process.env.PORT,()=>{
    console.log(`URL shortner app started on port ${process.env.PORT}`);
})