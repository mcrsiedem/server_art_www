const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const { DecodeToken } = require("../logowanie/DecodeToken");
const { ifNoDateSetNull_exec } = require("../czas/ifNoDateSetNull_exec");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("../logowanie/ACCESS_TOKEN");
const dataStore = require('../uprawnienia/dataStore');


// nowy zapis zamówienia - dane i parametry w jednym
const zamowieniePobierzWszystkie =(req,res)=>{
        const token = req.params['token']
        const orderby = req.params['orderby']
        let results
        let biala_lista = ["nr asc","naklad","ilosc_stron","data_przyjecia","data_spedycji","oprawa_id"]
        let id, zastepca1, zastepca2,zamowienia_wszystkie,dostep;


             jwt.verify(token,ACCESS_TOKEN,(err,decoded)=>{
                if(decoded){
                dostep = true
                id = decoded.id
                zastepca1 = decoded.zastepca1 | 0
                zastepca2 = decoded.zastepca2 | 0  
                zamowienia_wszystkie = dataStore.checkPrivileges(decoded.id,"zamowienia_wszystkie")

                }
                if(err){
                    dostep = false
                }
                
                

             })

             if(biala_lista.includes(orderby)){


                    if(zamowienia_wszystkie){
                        var sql =
                            "select * from artdruk.view_zamowienia where final is null ORDER BY " + orderby;
                        connection.execute(sql, function (err, doc) {
                            results = doc
                            if (err) throw err;
                            res.status(200).json(doc)
                        });

                    }else {
                    
                        var sql =
                            "select * from artdruk.view_zamowienia where (opiekun_id ="+ id +" or zastepca1 ="+ id +"  or zastepca1 ="+ id +")  and final is null ORDER BY " + orderby;
                        connection.execute(sql, function (err, doc) {
                            results = doc
                            if (err) throw err;
                            res.status(200).json(doc)
                        });

                    }

             }else{
                            res.status(200).json(results)

             }





    
    }


module.exports = {
  zamowieniePobierzWszystkie
    
}
 