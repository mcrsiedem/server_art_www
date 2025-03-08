
const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");


const zapiszTechnologieUpdate_oprawa=(oprawa,res) =>{

  for(let row of oprawa.filter(x => x.update == true && x.insert != true) ){
    var sql =   "update  artdruk.technologie_oprawa set  id = " + row.id+ ", zamowienie_id = " + row.zamowienie_id+ ", produkt_id = " + row.produkt_id+ ", oprawa = " + row.oprawa+ ", naklad = " + row.naklad+ ", bok_oprawy = '" + row.bok_oprawy+ "', data_spedycji = " + ifNoDateSetNull(row.data_spedycji)+ ", uwagi = '" + row.uwagi+ "', wersja = '" + row.wersja+ "', data_czystodrukow = " + ifNoDateSetNull(row.data_czystodrukow)+ ", indeks = " + row.indeks+ " where global_id = " + row.global_id + ""
    // connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   res.status(203).json(err)         }});
    connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   res.status(203).json(err)       }});
    }
  
  
    for(let row of oprawa.filter(x => x.insert == true && x.delete != true) ){
      var sql =   "INSERT INTO artdruk.technologie_oprawa (id,zamowienie_id,produkt_id,oprawa,naklad,bok_oprawy,data_spedycji,uwagi,wersja,data_czystodrukow,indeks) "+
      "values (" + row.id + "," + row.zamowienie_id + "," + row.produkt_id + "," + row.oprawa + "," + row.naklad + ",'" + row.bok_oprawy + "'," + ifNoDateSetNull(row.data_spedycji) + ",'" + row.uwagi + "','" + row.wersja + "'," + ifNoDateSetNull(row.data_czystodrukow) + "," + row.indeks + "); ";
      connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   res.status(203).json(err)          }});
      }
  
      for(let row of oprawa.filter(x => x.delete == true && x.insert != true) ){
          var sql =   "DELETE from artdruk.technologie_oprawa where global_id=" + row.global_id;
          connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   res.status(203).json(err)         }});
          } 

}

module.exports = {
  zapiszTechnologieUpdate_oprawa
    
}
 

// ifNoDateSetNull
// res.status(201).json(odpowiedz)