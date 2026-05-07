const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("./ACCESS_TOKEN");


const verifyToken=(req,res,next) =>{
    const token = req.params['token']

// console.log(req)
    if(!token){
      console.log("Brak tokenu" )
        return res.json({Error: "You are not Authenticated"});
    } else {
        jwt.verify(token,ACCESS_TOKEN,(err,decoded)=>{
            if(err){
              console.log("Błąd weryfikacji tokenu error: "+err )
              return res.json({Error: "Wrong token"});  
            } else{




              next();  
            }


            
        })
    }

}

module.exports = {
  verifyToken
    
}
 