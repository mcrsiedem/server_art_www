const { connection, pool } = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const zapiszTechnologieInsertOprawa = (req,res) =>{
  let promises = [];
  let oprawy= req.body[0]



  for (let oprawa of oprawy) {
    var sql =
    "INSERT INTO artdruk.technologie_oprawa (id,indeks,technologia_id,zamowienie_id,produkt_id,bok_oprawy,naklad,data_czystodrukow,data_spedycji,oprawa,wersja,uwagi) " +
    "values ('" +
    oprawa.id +  "','" +
    oprawa.indeks +        "','" +
    oprawa.technologia_id +        "','" +
    oprawa.zamowienie_id +        "','" +
    oprawa.produkt_id +        "','" +
    oprawa.bok_oprawy +        "','" +
    oprawa.naklad +        "'," +
    ifNoDateSetNull(oprawa.data_czystodrukow) +        "," +
      ifNoDateSetNull(oprawa.data_spedycji) +        ",'" +
    oprawa.oprawa+        "','" +
    oprawa.wersja +        "','" +
    oprawa.uwagi +        "'); ";

    promises.push(     new Promise((resolve, reject) => {
      connection.query(sql, (err, results) => {
      if (err) {
          resolve([{zapis: false},err]);               
      } else {
          // resolve([results,"ok arkusz"])
          resolve([{zapis: true}])
      }
  });
  })) 

}


  Promise.all(promises).then((data) => res.status(201).json(data));
}

module.exports = {
  zapiszTechnologieInsertOprawa
    
}
 