const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("./ACCESS_TOKEN");
const connection = require("../mysql");
const dataStore = require('../uprawnienia/dataStore');


function  verifyTokenParams(uprawnienie){


  
  return (req, res, next) => {
  const token = req.params.token


    if(!token){
        return res.json({Error: "You are not Authenticated"});
    } else {
        jwt.verify(token,ACCESS_TOKEN,(err,decoded)=>{

  
          
            if(err){
              return res.json({Error: "Wrong token"});  
            } 
            
            if(decoded  ){

                if( dataStore.checkPrivileges(decoded.id,uprawnienie)){
                var sql = "INSERT INTO artdruk.monitoring (user_id,imie,nazwisko) values ('" + decoded.id+ "','" + decoded.imie+ "','" + decoded.nazwisko+ "') ";
                connection.query(sql, function (err, result) {
                  if (err) throw err;
                })

                next();  


                }else{
                  console.log("Brak uprawnień do tej czynności")
                  return res.json({Error: "Brak uprawnień do tej czynności"});  

                }

            }


            
        })
    }
    






  }

}

module.exports = {
  verifyTokenParams
    
}
   

