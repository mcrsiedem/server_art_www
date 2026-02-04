const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("./ACCESS_TOKEN");
const { connection, pool } = require("../mysql");
const dataStore = require('../uprawnienia/dataStore');


function  verifyTokenParams(uprawnienie){


  
  return (req, res, next) => {
  const token = req.params.token

    // const clientApiKey = req.headers['x-api-key'];

    // if (!clientApiKey || clientApiKey !== VALID_API_KEY) {
    //   console.error(`[API KEY] Nieautoryzowany dostęp - Błędny klucz API: ${clientApiKey}`);
    //   return res.status(403).json({ Error: "Brak dostępu: Nieprawidłowy Klucz API aplikacji." });
    // }



    if(!token){
       console.log("Brak tokenu" )
        return res.json({Error: "You are not Authenticated"});
    } else {
        jwt.verify(token,ACCESS_TOKEN,(err,decoded)=>{

  
          
            if(err){
              console.log("Błąd weryfikacji tokenu error: "+err )
              return res.json({Error: "Wrong token"});  
            } 
            
            if(decoded  ){

                if( dataStore.checkPrivileges(decoded.id,uprawnienie)){
                // var sql = "INSERT INTO artdruk.monitoring (user_id,imie,nazwisko) values ('" + decoded.id+ "','" + decoded.imie+ "','" + decoded.nazwisko+ "') ";
                // connection.query(sql, function (err, result) {
                //   if (err) console.log(err);
                // })

                next();  


                }else{
                  console.log(uprawnienie+ " - brak uprawnień do tej czynności:"+  decoded.id + " " + decoded.imie+ " " + decoded.nazwisko )
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
   

