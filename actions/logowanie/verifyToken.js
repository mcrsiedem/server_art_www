const jwt = require("jsonwebtoken");

const ACCESS_TOKEN ='mcsdfsdg43sgkbajg45kt234ojgsdfsd234fsdkufgdgfdfg32423';

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
 