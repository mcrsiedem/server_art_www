
const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");


const zapiszTechnologieUpdate_legi=(legi) =>{


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
  connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   res.status(203).json(err)         }});
  }



  for(let row of legi.filter(x => x.insert == true && x.delete != true) ){
    var sql =
    "INSERT INTO artdruk.technologie_legi(id,indeks,technologia_id,typ_elementu,rodzaj_legi,element_id,arkusz_id,ilosc_stron,naklad,uwagi) " +
    "values ('" +
    row.id +  "','" +
    row.indeks +        "','" +
    row.technologia_id +        "','" +
    row.typ_elementu +        "','" +
    row.rodzaj_legi +        "','" +
    row.element_id +        "','" +
    row.arkusz_id +        "','" +
    row.ilosc_stron +        "','" +
    row.naklad +        "','" +
    row.uwagi +        "'); ";
  connection.query(sql, function (err, result) {
      if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
  });
  

    for(let row of elementyTechEdit.filter(x => x.delete == true && x.insert != true) ){
        var sql =   "DELETE from artdruk.technologie_elementy where global_id=" + row.global_id;
        connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   res.status(203).json(err)         }});
        }

}
}

module.exports = {
  zapiszTechnologieUpdate_legi
  
}
 