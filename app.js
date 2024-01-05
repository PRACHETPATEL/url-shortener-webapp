const express=require("express");
const urlRouter=require("./routes/urlRouter");
const userRouter=require("./routes/userRouter");
const app=express();
const path=require("path")
require("dotenv").config()
const logger=require("morgan");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./db/connectDb");
const cookieParser = require('cookie-parser');

const redirectRouter=require("./routes/redirectRouter")
connectDB();
app.set("view engine","ejs");
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser())
app.use(logger("tiny"));
app.use(express.static(path.join(__dirname,"./public")));
app.use((req, res, next) => {
    if (req.path.endsWith('/') && req.path.length > 1) {
        const newPath = req.path.slice(0, -1);
        return res.redirect(301, newPath + req.url.slice(req.path.length));
    }
    next();
});
app.use("/api/url",urlRouter);
app.use("/api/user",userRouter);
app.use("/",redirectRouter);

app.use(errorHandler);
app.get("*",(req, res) => {
    res.status(404);
    res.render("error",{title:"Not Found",message:"Url Not Found!!",d1:4,d2:0,d3:4});
});
app.listen(process.env.PORT,()=>{
    console.log(`URL shortner app started on port ${process.env.PORT}`);
})