
const { connection, pool } = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");


const zapiszTechnologieUpdate_legi=(legi,res) =>{


for(let row of legi.filter(x => x.update == true && x.insert != true) ){
  var sql =   "update  artdruk.technologie_legi set  " +
  "id = " + row.id+ 
  ", indeks = " + row.indeks+ 
  ", technologia_id = " + row.technologia_id+ 
  ", zamowienie_id = " + row.zamowienie_id+ 
  ", typ_elementu = " + row.typ_elementu+ 
  ", ilosc_stron = " + row.ilosc_stron+ 
  ", rodzaj_legi = '" + row.rodzaj_legi+ 
  "', element_id = " + row.element_id+ 
  ", arkusz_id = " + row.arkusz_id+ 
  ", ilosc_stron = " + row.ilosc_stron+ 
  ", naklad = " + row.naklad+ 
  ", nr_legi = '" + row.nr_legi+ 
  "', uwagi = '" + row.uwagi+ 
  "' where global_id = " + row.global_id + ""
  connection.query(sql, function (err, result) {      if (err)console.log(err)     });
  }



  for(let row of legi.filter(x => x.insert == true && x.delete != true) ){
    var sql =
    "INSERT INTO artdruk.technologie_legi(id,indeks,technologia_id,zamowienie_id,typ_elementu,rodzaj_legi,element_id,arkusz_id,ilosc_stron,naklad,nr_legi,uwagi) " +
    "values ('" +
    row.id +  "','" +
    row.indeks +        "','" +
    row.technologia_id +        "','" +
    row.zamowienie_id +        "','" +
    row.typ_elementu +        "','" +
    row.rodzaj_legi +        "','" +
    row.element_id +        "','" +
    row.arkusz_id +        "','" +
    row.ilosc_stron +        "','" +
    row.naklad +        "','" +
    row.nr_legi +        "','" +
    row.uwagi +        "'); ";
    connection.query(sql, function (err, result) {      if (err)console.log(err)     });
  

 

}

   for(let row of legi.filter(x => x.delete == true && x.insert != true) ){
        var sql =   "DELETE from artdruk.technologie_legi where global_id=" + row.global_id;
        connection.query(sql, function (err, result) {      if (err)console.log(err)     });
        }

}

module.exports = {
  zapiszTechnologieUpdate_legi
  
}
 