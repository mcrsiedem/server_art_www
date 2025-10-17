const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("./ACCESS_TOKEN");
const connection = require("../mysql");


const verifyToken=(req,res,next) =>{
    const token = req.params['token']

// console.log(req)
    if(!token){
        return res.json({Error: "You are not Authenticated"});
    } else {
        jwt.verify(token,ACCESS_TOKEN,(err,decoded)=>{
            if(err){
              return res.json({Error: "Wrong token"});  
            } else{

                var sql = "INSERT INTO artdruk.monitoring (user_id,imie,nazwisko) values ('" + decoded.id+ "','" + decoded.imie+ "','" + decoded.nazwisko+ "') ";
                connection.query(sql, function (err, result) {
                  if (err) console.log(err);
                })

              next();  
            }


            
        })
    }

}

module.exports = {
  verifyToken
    
}
 