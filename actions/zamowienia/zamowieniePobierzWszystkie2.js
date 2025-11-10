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
const zestaw = "biezace"
let results
let biala_lista = ["nr asc","naklad","ilosc_stron","data_przyjecia","data_spedycji","oprawa_id"]
let biala_lista_zestaw = ["biezace","naklad","ilosc_stron","data_przyjecia","data_spedycji","oprawa_id"]
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

if(biala_lista.includes(orderby) && biala_lista_zestaw.includes(zestaw)){





  // var sql = "SELECT * FROM artdruk.view_zamowienia where (etap > 1 and faktury_status !=3 and etap <17 and status != 7) or (etap > 1 and etap <16 and status != 7) ORDER BY " + orderby;
  //SELECT * FROM artdruk.view_zamowienia where (etap > 1 and faktury_status !=3 and etap <17 and status != 7) or (etap > 1 and etap <16 and status != 7);
  try {
    const [rows] = zamowienia_wszystkie ? await pool.execute(sqlIn(zestaw,orderby,zamowienia_wszystkie)) : await pool.execute(sqlIn(zestaw,orderby,zamowienia_wszystkie), [id, id, id])
    results = [rows];
    res.status(200).json(rows);
  } catch (err) {
    console.error("Błąd w Kontrolerze:", err);
    res.status(500).json({ error: "Błąd serwera." });
  }      

}else{
              res.status(200).json(results)
}



}

const sqlIn = (zestaw,orderby,zamowienia_wszystkie) => {

let sql;
 
if(zamowienia_wszystkie){
  switch (zestaw) {
  case "biezace":
    // Od NOWE do ODDANE bez faktury
    // sql = "SELECT * FROM artdruk.view_zamowienia where (etap > 1 and faktury_status !=3 and etap <17 and status != 7) or (etap > 1 and etap <16 and status != 7) ORDER BY " + orderby;
    sql = "SELECT * FROM artdruk.view_zamowienia where (etap > 1 and etap <16 and status != 7)  ORDER BY " + orderby;

  break;

  default:
    sql = "SELECT * FROM artdruk.view_zamowienia where (etap > 1 and faktury_status !=3 and etap <17 and status != 7) or (etap > 1 and etap <16 and status != 7) ORDER BY " + orderby;
}
}else{

switch (zestaw) {
  case "biezace":
    // Od NOWE do ODDANE bez faktury
 sql = "select * from artdruk.view_zamowienia where (opiekun_id =? or asystent1 =?  or asystent1 =?)  and (etap > 1 and etap <16 and status != 7) ORDER BY " + orderby;
  break;

  default:
    sql = "select * from artdruk.view_zamowienia where (opiekun_id =? or asystent1 =?  or asystent1 =?)  and (etap > 1 and etap <16 and status != 7) ORDER BY " + orderby;
}


}



  return sql 
}






// const sqlInOwn = (zestaw,orderby) => {
//   // klienci tylko jednego handlowca
// let sql;
 
// switch (zestaw) {
//   case "biezace":
//     // Od NOWE do ODDANE bez faktury
//  sql = "select * from artdruk.view_zamowienia where (opiekun_id =? or asystent1 =?  or asystent1 =?)  and (etap > 1 and etap <16 and status != 7) ORDER BY " + orderby;
//   break;

//   default:
//     sql = "select * from artdruk.view_zamowienia where (opiekun_id =? or asystent1 =?  or asystent1 =?)  and (etap > 1 and etap <16 and status != 7) ORDER BY " + orderby;
// }

//   return sql 
// }





module.exports = {
  zamowieniePobierzWszystkie
    
}
 