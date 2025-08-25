const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const zapiszTechnologieInsertProdukty = (req,res) =>{
  let promises = [];
  let produkty = req.body[0]



  for (let produkt of produkty) {
    var sql =
      "INSERT INTO artdruk.technologie_produkty (technologia_id,id,zamowienie_id,typ,indeks,naklad,nazwa,ilosc_stron,format_x,format_y,oprawa,uwagi,etap,stan,status) " +
      "values ('" +
      produkt.technologia_id +  "','" +
      produkt.id +        "','" +
      produkt.zamowienie_id +        "','" +
      produkt.typ +        "','" +
      produkt.indeks +        "','" +
      produkt.naklad +        "','" +
      produkt.nazwa +        "','" +
      produkt.ilosc_stron +        "','" +
      produkt.format_x +        "','" +
      produkt.format_y +        "','" +
      produkt.oprawa +        "','" +
      produkt.uwagi +        "'," +
      produkt.etap +        "," +
      produkt.stan +        "," +
      produkt.status +        "); ";

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


  var sql =   "update  artdruk.zamowienia set  technologia_id=" + produkty[0].technologia_id+ ",stan=3,status=2 where id = '" + produkty[0].zamowienie_id + "'"

  promises.push(     new Promise((resolve, reject) => {
      connection.query(sql, (err, results) => {
      if (err) {
          resolve([{zapis: false},err]);               
      } else {
          resolve([{zapis: true}])
      }
  });
  })) 


  Promise.all(promises).then((data) => res.status(201).json(data));
}

module.exports = {
  zapiszTechnologieInsertProdukty
    
}
 