const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("./ACCESS_TOKEN");


const verifyToken=(req,res,next) =>{
    const token = req.params['token']


    if(!token){
        return res.json({Error: "You are not Authenticated"});
    } else {
        jwt.verify(token,ACCESS_TOKEN,(err,decoded)=>{
            if(err) return res.json({Error: "Wrong token"});
            next();
        })
    }

}

module.exports = {
  verifyToken
    
}
 