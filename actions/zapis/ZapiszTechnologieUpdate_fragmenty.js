
const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");


const zapiszTechnologieUpdate_fragmenty=(fragmentyTechEdit,res) =>{


for(let row of fragmentyTechEdit.filter(x => x.update == true && x.insert != true) ){
  var sql =   "update  artdruk.technologie_fragmenty set  " +
  "id = " + row.id+ 
  "', typ = " + row.typ+ 
  ", stan = " + row.stan+ 
  ", status = " + row.etap+ 
  ", etap = " + row.etap+ 
  ", arkusz_szerokosc = '" + row.arkusz_szerokosc+ 
  "', arkusz_wysokosc = '" + row.arkusz_wysokosc+ 
  "' where global_id = " + row.global_id + ""
  connection.query(sql, function (err, result) {      if (err)throw err     });
  }

  for(let row of fragmentyTechEdit.filter(x => x.insert == true && x.delete != true) ){
    "INSERT INTO artdruk.technologie_fragmenty (id,indeks,technologia_id,zamowienie_id,produkt_id,element_id,oprawa_id,typ,ilosc_stron,wersja,naklad,info) " +
    "values ('" +
    row.id +  "','" +
    row.indeks +        "','" +
    row.technologia_id +        "','" +
    row.zamowienie_id +        "','" +
    row.produkt_id +        "','" +
    row.element_id +        "','" +
    row.oprawa_id +        "','" +
    row.typ +        "','" +
    row.ilosc_stron +        "','" +
    row.wersja +        "','" +
    row.naklad +        "','" +
    row.info +        "'); ";
    connection.query(sql, function (err, result) {      if (err)throw err     });
    }

    for(let row of fragmentyTechEdit.filter(x => x.delete == true && x.insert != true) ){
        var sql =   "DELETE from artdruk.technologie_fragmenty where global_id=" + row.global_id;
        connection.query(sql, function (err, result) {      if (err)throw err     });
        }

}

module.exports = {
  zapiszTechnologieUpdate_fragmenty
    
}
 