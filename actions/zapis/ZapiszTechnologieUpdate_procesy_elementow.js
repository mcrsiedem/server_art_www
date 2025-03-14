
const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");


const zapiszTechnologieUpdate_procesy_elementow=(procesyElementow) =>{


  for(let row of procesyElementow.filter(x => x.update == true && x.insert != true) ){
    var sql =   "update  artdruk.technologie_procesy_elementow set " +
    " id = " + row.id+ 
    ", zamowienie_id = " + row.zamowienie_id+ 
    ", technologia_id = " + row.technologia_id+ 
    ", produkt_id = " + row.produkt_id+ 
    ", element_id = " + row.element_id+ 
    ", proces_id = " + row.proces_id+ 
    ", front_ilosc = '" + row.front_ilosc+ 
    "', back_ilosc = '" + row.back_ilosc+ 
    "', front_kolor = '" + row.front_kolor+ 
    "', back_kolor = '" + row.back_kolor+ 
    "', info = '" + row.info+ 
    "', nazwa = '" + row.nazwa+ 
    "', nazwa_id = " + row.nazwa_id+ 
    ",  indeks = " + row.indeks+ 
    " where global_id = " + row.global_id + ""
    connection.query(sql, function (err, result) {      if (err)throw err     });;
    }
  
  
    for(let row of procesyElementow.filter(x => x.insert == true && x.delete != true) ){
      var sql =   "INSERT INTO artdruk.technologie_procesy_elementow (id,zamowienie_id,technologia_id,produkt_id,element_id,proces_id,front_ilosc,back_ilosc,front_kolor,back_kolor,info,nazwa_id,indeks) "+
      "values (" + row.id + "," + row.zamowienie_id + "," + row.technologia_id + "," + row.produkt_id + "," + row.element_id + "," + row.proces_id + ",'" + row.front_ilosc + "','" + row.back_ilosc + "','" + row.front_kolor + "','" + row.back_kolor + "','" + row.info + "'," + row.nazwa_id + "," + row.indeks + "); ";
      connection.query(sql, function (err, result) {      if (err)throw err     });
      }
  
      for(let row of procesyElementow.filter(x => x.delete == true && x.insert != true) ){
          var sql =   "DELETE from artdruk.technologie_procesy_elementow where global_id=" + row.global_id;
          connection.query(sql, function (err, result) {      if (err)throw err     });
          }

}

module.exports = {
  zapiszTechnologieUpdate_procesy_elementow
    
}
 