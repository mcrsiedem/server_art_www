const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const { DecodeToken } = require("../logowanie/DecodeToken");
const { ifNoDateSetNull_exec } = require("../czas/ifNoDateSetNull_exec");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("../logowanie/ACCESS_TOKEN");
const dataStore = require('../uprawnienia/dataStore');


// nowy zapis zamówienia - dane i parametry w jednym
const klienciPobierzWszystkich =(req,res)=>{
        const token = req.params['token']
        let results
        let id,klienci_wszyscy;


             jwt.verify(token,ACCESS_TOKEN,(err,decoded)=>{
                if(decoded){
       
                id = decoded.id
                klienci_wszyscy = dataStore.checkPrivileges(decoded.id,"klienci_wszyscy")

                }
                if(err){
                    res.status(200).json("Bład")
                }
                
                

             })

    


                    if(klienci_wszyscy){
                     var sql  = "select * from artdruk.view_klienci ORDER BY firma ASC";
                        connection.execute(sql, function (err, doc) {
                            results = doc
                            if (err) throw err;
                            res.status(200).json(doc)
                        });

                    }else {
                    
                        var sql =
                            "select * from artdruk.view_klienci where (opiekun_id ="+ id +" or asystent1 ="+ id +"  or asystent1 ="+ id +")  ORDER BY firma ASC" ;
                        connection.execute(sql, function (err, doc) {
                            results = doc
                            if (err) throw err;
                            res.status(200).json(doc)
                        });

                    }

 





    
    }


module.exports = {
  klienciPobierzWszystkich
    
}
 