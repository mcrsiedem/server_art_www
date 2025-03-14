
const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");


const zapiszTechnologieUpdate_arkusze=(arkusze,res) =>{


for(let row of arkusze.filter(x => x.update == true && x.insert != true) ){
  var sql =   "update  artdruk.technologie_arkusze set  " +
  "id = " + row.id+ 
  ", indeks = " + row.indeks+ 
  ", technologia_id = " + row.technologia_id+ 
  ", typ_elementu = " + row.typ_elementu+ 
  ", ilosc_stron = " + row.ilosc_stron+ 
  ", rodzaj_arkusza = " + row.rodzaj_arkusza+ 
  ", element_id = " + row.element_id+ 
  ", nr_arkusza = '" + row.nr_arkusza+ 
  "', ilosc_stron = " + row.ilosc_stron+ 
  ", ilosc_leg = " + row.ilosc_leg+ 
  ", papier_id = " + row.papier_id+ 
  ", arkusz_szerokosc = '" + row.arkusz_szerokosc+ 
  "', arkusz_wysokosc = '" + row.arkusz_wysokosc+ 
  "', naklad = '" + row.naklad+ 
  "', nadkomplet = '" + row.nadkomplet+ 
  "', uwagi = '" + row.uwagi+ 
  "' where global_id = " + row.global_id + ""
  connection.query(sql, function (err, result) {      if (err)throw err     });
  }



  for(let row of arkusze.filter(x => x.insert == true && x.delete != true) ){
    var sql =
    "INSERT INTO artdruk.technologie_arkusze (id,indeks,technologia_id,typ_elementu,rodzaj_arkusza,nr_arkusza,element_id,ilosc_stron,ilosc_leg,papier_id,arkusz_szerokosc,arkusz_wysokosc,naklad,nadkomplet,uwagi) " +
    "values ('" +
    row.id +  "','" +
    row.indeks +        "','" +
    row.technologia_id +        "','" +
    row.typ_elementu +        "','" +
    row.rodzaj_arkusza +        "','" +
    row.nr_arkusza +        "','" +
    row.element_id +        "','" +
    row.ilosc_stron +        "','" +
    row.ilosc_leg+        "','" +
    row.papier_id+        "','" +
    row.arkusz_szerokosc+        "','" +
    row.arkusz_wysokosc+        "','" +
    row.naklad +        "','" +
    row.nadkomplet +        "','" +
    row.uwagi +        "'); ";
  connection.query(sql, function (err, result) {      if (err)throw err     });
  
}

    for(let row of arkusze.filter(x => x.delete == true && x.insert != true) ){
        var sql =   "DELETE from artdruk.technologie_arkusze where global_id=" + row.global_id;
        connection.query(sql, function (err, result) {      if (err)throw err     });
        }

}

module.exports = {
  zapiszTechnologieUpdate_arkusze
  
}
 