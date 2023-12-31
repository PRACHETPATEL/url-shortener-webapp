const express=require("express");
const urlRouter=require("./routes/urlRouter");
const userRouter=require("./routes/userRouter");
const app=express();
const path=require("path")
require("dotenv").config()
const logger=require("morgan");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./db/connectDb");
const redirectRouter = require("./routes/redirectRouter");
connectDB();
app.set("view engine","ejs");
app.use(express.json());
app.use(logger("combined"));
app.use(express.static(path.join(__dirname,"./public")));

app.use("/api/url",urlRouter);
app.use("/api/user",userRouter);
app.use("/",redirectRouter)
app.use(errorHandler);

app.listen(process.env.PORT,()=>{
    console.log(`URL shortner app started on port ${process.env.PORT}`);
})