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
let biala_lista_zestaw = ["biezace","wydrukowane","sfalcowane","oprawione","oddane","wszystkie"]
let id,zamowienia_wszystkie,dostep;

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


  try {
    const [rows] = await pool.execute(sqlIn(id,zestaw,orderby,zamowienia_wszystkie)) 
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

const sqlIn = (id,zestaw,orderby,zamowienia_wszystkie) => {

let sql;
let opiekun;

zamowienia_wszystkie ? opiekun = " " :  opiekun = "(opiekun_id = "+id+" or asystent1 = "+id+"  or asystent1 = "+id+")  and" 


  switch (zestaw) {
  case "biezace":  // Od NOWE do ODDANE bez faktury
    sql = "SELECT * FROM artdruk.view_zamowienia where "+opiekun+" (etap > 1 and etap <16 and status != 7)  ORDER BY " + orderby;
  break;

  case "wydrukowane":  // wydrukowane i nie anulowane
    sql = "SELECT * FROM artdruk.view_zamowienia where "+opiekun+" (etap =8 and status != 7)  ORDER BY " + orderby;
  break;

 case "sfalcowane":  // sfalcowane i nie anulowane
    sql = "SELECT * FROM artdruk.view_zamowienia where "+opiekun+" (etap =10 and status != 7)  ORDER BY " + orderby;
  break;

   case "oprawione":  // oprawione i nie anulowane
    sql = "SELECT * FROM artdruk.view_zamowienia where "+opiekun+" (etap =11 and status != 7)  ORDER BY " + orderby;
  break;

  case "oddane":  // Oddane
    sql = "SELECT * FROM artdruk.view_zamowienia where "+opiekun+" (etap = 16 and status != 7)  ORDER BY " + orderby;
  break;

  case "wszystkie":  // wszystkie
    sql = "SELECT * FROM artdruk.view_zamowienia where "+opiekun+" id > 1  ORDER BY " + orderby;
  break;

  default: // Od NOWE do ODDANE bez faktury
   sql = "SELECT * FROM artdruk.view_zamowienia where "+opiekun+" (etap > 1 and etap <16 and status != 7)  ORDER BY " + orderby;
}

  return sql 
}


module.exports = {
  zamowieniePobierzWszystkie
    
}
 