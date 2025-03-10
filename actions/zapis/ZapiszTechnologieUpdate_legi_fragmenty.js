
const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");


const zapiszTechnologieUpdate_legi_fragmenty=(legi) =>{


for(let row of legi.filter(x => x.update == true && x.insert != true) ){
  var sql =   "update  artdruk.technologie_legi_fragmenty set  " +
  "id = " + row.id+ 
  ", indeks = " + row.indeks+ 
  ", technologia_id = " + row.technologia_id+ 
  ", fragment_id = " + row.fragment_id+ 
  ", element_id = " + row.element_id+ 
  ", arkusz_id = " + row.arkusz_id+ 
  ", lega_id = " + row.lega_id+ 
  ", oprawa_id = " + row.oprawa_id+ 
  ", naklad = " + row.naklad+ 
  ", typ = " + row.typ+ 
  ", wersja = '" + row.wersja+ 
  "' where global_id = " + row.global_id + ""
  connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   res.status(203).json(err)         }});
  }



  for(let row of legi.filter(x => x.insert == true && x.delete != true) ){
    var sql =
    "INSERT INTO artdruk.technologie_legi_fragmenty(id,indeks,technologia_id,element_id,fragment_id,arkusz_id,lega_id,naklad,oprawa_id,typ,wersja) " +
    "values ('" +
    row.id +  "','" +
    row.indeks +        "','" +
    row.technologia_id +        "','" +
    row.element_id +        "','" +
    row.fragment_id +        "','" +
    row.arkusz_id +        "','" +
    row.lega_id +        "','" +
    row.naklad +        "','" +
    row.oprawa_id +        "','" +
    row.typ +        "','" +
    row.wersja +        "'); ";
  connection.query(sql, function (err, result) {
      if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
  });
  

    for(let row of legi.filter(x => x.delete == true && x.insert != true) ){
        var sql =   "DELETE from artdruk.technologie_legi_fragmenty where global_id=" + row.global_id;
        connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   res.status(203).json(err)         }});
        }

}
}

module.exports = {
  zapiszTechnologieUpdate_legi_fragmenty
  
}
 