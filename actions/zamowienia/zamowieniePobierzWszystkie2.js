const { connection, pool } = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const { DecodeToken } = require("../logowanie/DecodeToken");
const { ifNoDateSetNull_exec } = require("../czas/ifNoDateSetNull_exec");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("../logowanie/ACCESS_TOKEN");
const dataStore = require('../uprawnienia/dataStore');


// nowy zapis zamówienia - dane i parametry w jednym
const zamowieniePobierzWszystkie = async (req,res)=>{
        const token = req.params['token']
        const orderby = req.params['orderby']
        let results
        let biala_lista = ["nr asc","naklad","ilosc_stron","data_przyjecia","data_spedycji","oprawa_id"]
        let id, asystent1, asystent2,zamowienia_wszystkie,dostep;

             jwt.verify(token,ACCESS_TOKEN,(err,decoded)=>{
                if(decoded){
                dostep = true
                id = decoded.id
                zamowienia_wszystkie = dataStore.checkPrivileges(decoded.id,"zamowienia_wszystkie")
                }
                if(err){
                    res.status(200).json("Bład")
                }
             })

             if(biala_lista.includes(orderby)){

                    if(zamowienia_wszystkie){


                var sql = "select * from artdruk.view_zamowienia where final is null ORDER BY " + orderby;
                try {
                  const [rows] = await pool.execute(sql);
                  results = [rows];
                  res.status(200).json(rows);
                } catch (err) {
                  console.error("Błąd w Kontrolerze:", err);
                  res.status(500).json({ error: "Błąd serwera." });
                }      








                    }else {

                        var sql = "select * from artdruk.view_zamowienia where (opiekun_id =? or asystent1 =?  or asystent1 =?)  and final is null ORDER BY " + orderby;

                    try {
                      const [rows] = await pool.execute(sql, [id, id, id]);
                      results = [rows];
                      res.status(200).json(rows);
                    } catch (err) {
                      console.error("Błąd w Kontrolerze:", err);
                      res.status(500).json({ error: "Błąd serwera." });
                    }      
                    }


             }else{
                            res.status(200).json(results)
             }





    
    }


module.exports = {
  zamowieniePobierzWszystkie
    
}
 