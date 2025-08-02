const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const { DecodeToken } = require("../logowanie/DecodeToken");
const { ifNoDateSetNull_exec } = require("../czas/ifNoDateSetNull_exec");

// nowy zapis zamówienia - dane i parametry w jednym
const zamowieniePobierzWszystkie =(req,res)=>{
        const orderby = req.params['orderby']
        let results
        let biala_lista = ["nr asc","naklad","ilosc_stron","data_przyjecia","data_spedycji","oprawa_id"]


        if(biala_lista.includes(orderby)){
            var sql =
                "select * from artdruk.view_zamowienia where final is null ORDER BY " + orderby;
            connection.execute(sql, function (err, doc) {
                results = doc
                if (err) throw err;
                 res.status(200).json(doc)
            });

        }else {
          res.status(200).json(results)  
        }
       


    
    }


module.exports = {
  zamowieniePobierzWszystkie
    
}
 