
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
     connection.query(sql, function (err, result) {      if (err)throw err     });
  }



}

module.exports = {
    zapiszTechnologieUpdate_produkty
    
}
 