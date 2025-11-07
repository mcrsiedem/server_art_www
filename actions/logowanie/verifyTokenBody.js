const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("./ACCESS_TOKEN");



const verifyTokenBody=(req,res,next) =>{

    const token= req.body.token;
   //console.log("token z cookie! "+token)
    if(!token){
        console.log("Brak tokenu" )
        return res.json({Error: "You are not Authenticated"});
    } else {
        jwt.verify(token,ACCESS_TOKEN,(err,decoded)=>{
            if(err){
            console.log("Błąd weryfikacji tokenu error: "+err )
                return res.json({Error: "Wrong token"});
            }else{

                next();
            }
        })
    }
    //console.log("next");
}

module.exports = {
    verifyTokenBody
    
}
 