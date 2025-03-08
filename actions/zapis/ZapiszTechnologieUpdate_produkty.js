
const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");


const zapiszTechnologieUpdate_produkty=(produktyTechEdit,res) =>{


for(let row of produktyTechEdit.filter(x => x.update == true && x.insert != true) ){
  var sql =   "update  artdruk.technologie_produkty set " +
     "id = " + row.id+ 
     ", zamowienie_id = " + row.zamowienie_id+
     ", nazwa = '" + row.nazwa+
     "', uwagi = '" + row.uwagi+ 
     "', stan = " + row.stan+ 
     ", status = " + row.status+ 
     ", etap = " + row.etap+ 
     ", typ = '" + row.typ+ 
     "', ilosc_stron = " + row.ilosc_stron+ 
     ", format_x = '" + row.format_x+ 
     "', format_y = '" + row.format_y+ 
     "', oprawa = '" + row.oprawa+ 
     "', naklad = " + row.naklad+ 
     ",  indeks = " + row.indeks+ 
     " where global_id = " + row.global_id + ""
  connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   res.status(203).json(err)         }});
  }

  // for(let row of produktyTechEdit.filter(x => x.insert == true && x.delete != true) ){
  //   var sql =   "INSERT INTO artdruk.technologie_produkty (id,zamowienie_id,nazwa,wersja,opiekun_zamowienia_id,uwagi,stan,status,typ,ilosc_stron,format_x,format_y,oprawa,naklad,indeks) "+
  //   "values (" + row.id + 
  //   "," + row.zamowienie_id + 
  //   "," + row.produkt_id + 
  //   "," + row.element_id + 
  //   "," + row.oprawa_id + 
  //   ",'" + row.naklad + 
  //   "','" + row.ilosc_stron + 
  //   "','" + row.wersja + 
  //   "','" + row.info + 
  //   "','" + row.typ + 
  //   "'," + row.indeks + 
  //   "); ";
  //   connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   res.status(203).json(err)         }});
  //   }

  //   for(let row of produktyTechEdit.filter(x => x.delete == true && x.insert != true) ){
  //       var sql =   "DELETE from artdruk.technologie_produkty where global_id=" + row.global_id;
  //       connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   res.status(203).json(err)         }});
  //       }


}

module.exports = {
    zapiszTechnologieUpdate_produkty
    
}
 