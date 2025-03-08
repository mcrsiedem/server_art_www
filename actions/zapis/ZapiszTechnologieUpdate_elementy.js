
const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");


const zapiszTechnologieUpdate_elementy=(elementyTechEdit) =>{


for(let row of elementyTechEdit.filter(x => x.update == true && x.insert != true) ){
  var sql =   "update  artdruk.technologie_elementy set  " +
  "id = " + row.id+ 
  ", zamowienie_id = " + row.zamowienie_id+ 
  ", produkt_id = " + row.produkt_id+ 
  ", nazwa = '" + row.nazwa+ 
  "', typ = " + row.typ+ 
  ", ilosc_stron = " + row.ilosc_stron+ 
  ", format_x = '" + row.format_x+ 
  "', format_y = '" + row.format_y+ 
  "', papier_id = " + row.papier_id+ 
  ", naklad = " + row.naklad+ 
  ", uwagi = '" + row.uwagi+ 
  "', ilosc_leg = " + row.ilosc_leg+ 
  ", lega = " + row.lega+ 
  ", stan = " + row.stan+ 
  ", status = " + row.etap+ 
  ", etap = " + row.etap+ 
  ", arkusz_szerokosc = '" + row.arkusz_szerokosc+ 
  "', arkusz_wysokosc = '" + row.arkusz_wysokosc+ 
  "' where global_id = " + row.global_id + ""
  connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
  }

  for(let row of elementyTechEdit.filter(x => x.insert == true && x.delete != true) ){
    var sql =   "INSERT INTO artdruk.technologie_elementy (id,zamowienie_id,produkt_id,nazwa,typ,ilosc_stron,format_x,format_y,papier_id,ilosc_leg,lega,arkusz_szerokosc,arkusz_wysokosc,naklad,uwagi,stan,status,etap,indeks) "+
    "values (" 
    + row.id + "," 
    + row.zamowienie_id + "," 
    + row.produkt_id + ",'" 
    + row.nazwa + "'," 
    + row.typ + "," 
    + row.ilosc_stron + "," 
    + row.format_x + "," 
    + row.format_y + "," 
    + row.papier_id + "," 
    + row.ilosc_leg + "," 
    + row.lega + "," 
    + row.arkusz_szerokosc + "," 
    + row.arkusz_wysokosc + "," 
    + row.naklad + ",'" 
    + row.uwagi + "'," 
    + row.stan + "," 
    + row.status + "," 
    + row.etap + "," 
    + row.indeks + "'); ";
    connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
    }

    for(let row of elementyTechEdit.filter(x => x.delete == true && x.insert != true) ){
        var sql =   "DELETE from artdruk.technologie_elementy where global_id=" + row.global_id;
        connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
        }

}

module.exports = {
  zapiszTechnologieUpdate_elementy
    
}
 