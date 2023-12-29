const { constants } = require("../constants");


const errorHandler=(err,req,res,next)=>{
    const statusCode=res.statusCode?res.statusCode:500;
    switch(statusCode){
        case constants.VALIDATION_ERROR:
            res.render("error",{title:"Validation Failed",message:err.message,stakeTrace:err.stack,d1:4,d2:0,d3:0});
            break;  
        case constants.NOT_FOUND:
            res.render("error",{title:"Not Found",message:err.message,stakeTrace:err.stack,d1:4,d2:0,d3:4});
            break;
        case constants.FORBIDDEN:
            res.render("error",{title:"Forbidden",message:err.message,stakeTrace:err.stack,d1:4,d2:0,d3:3});
            break;
        case constants.UNAUTHORIZED:
            res.render("error",{title:"Unauthorized",message:err.message,stakeTrace:err.stack,d1:4,d2:0,d3:1});
            break;
        case constants.SERVER_ERROR:
            res.render("error",{title:"Internal Server Error",message:err.message,stakeTrace:err.stack,d1:5,d2:0,d3:0});
            break;
        default:
            break;
    }
   
   
}
module.exports=errorHandler;