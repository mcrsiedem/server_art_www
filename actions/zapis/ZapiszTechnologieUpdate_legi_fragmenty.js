
const { connection, pool } = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");


const zapiszTechnologieUpdate_legi_fragmenty=(legiFragmentyEdit) =>{


for(let row of legiFragmentyEdit.filter(x => x.update == true && x.insert != true) ){
  var sql =   "update  artdruk.technologie_legi_fragmenty set  " +
  "id = " + row.id+ 
  ", indeks = " + row.indeks+ 
  ", technologia_id = " + row.technologia_id+ 
  // ", fragment_id = " + row.fragment_id+ 
  ", element_id = " + row.element_id+ 
  ", arkusz_id = " + row.arkusz_id+ 
  ", lega_id = " + row.lega_id+ 
  ", oprawa_id = " + row.oprawa_id+ 
  ", naklad = " + row.naklad+ 
  ", typ = " + row.typ+ 
  ", nr_legi = '" + row.nr_legi+ 
  "', wersja = '" + row.wersja+ 
  "' where global_id = " + row.global_id + ""
  connection.query(sql, function (err, result) {      if (err)console.log(err)     });
  }



  for(let row of legiFragmentyEdit.filter(x => x.insert == true && x.delete != true) ){
    var sql =
    "INSERT INTO artdruk.technologie_legi_fragmenty(id,indeks,technologia_id,element_id,arkusz_id,lega_id,nr_legi,naklad,oprawa_id,typ,wersja) " +
    "values ('" +
    row.id +  "','" +
    row.indeks +        "','" +
    row.technologia_id +        "','" +
    row.element_id +        "','" +
    // row.fragment_id +        "','" +
    row.arkusz_id +        "','" +
    row.lega_id +        "','" +
    row.nr_legi +        "','" +
    row.naklad +        "'," +
    row.oprawa_id +        ",'" +
    row.typ +        "','" +
    row.wersja +        "'); ";
    connection.query(sql, function (err, result) {      if (err)console.log(err)     });
  


}

    for(let row of legiFragmentyEdit.filter(x => x.delete == true && x.insert != true) ){
        var sql =   "DELETE from artdruk.technologie_legi_fragmenty where global_id=" + row.global_id;
        connection.query(sql, function (err, result) {      if (err)console.log(err)     });
        }


}

module.exports = {
  zapiszTechnologieUpdate_legi_fragmenty
  
}
 