const { connection, pool } = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const zapiszTechnologieInsertElementy = (req,res) =>{
  let promises = [];
  let elementy = req.body[0]

  // .filter(x => x.insert == true && x.delete != true)

  for (let element of elementy.filter(x =>  x.delete != true)) {
    var sql =
    "INSERT INTO artdruk.technologie_elementy (id,indeks,technologia_id,zamowienie_id,produkt_id,nazwa,typ,lega,ilosc_leg,ilosc_stron,format_x,format_y,papier_id,papier_postac_id,papier_info,arkusz_szerokosc,arkusz_wysokosc,naklad,uwagi,etap,stan,status) " +
    "values ('" +
    element.id +  "','" +
    element.indeks +        "','" +
    element.technologia_id +        "','" +
    element.zamowienie_id +        "','" +
    element.produkt_id +        "','" +
    element.nazwa +        "','" +
    element.typ +        "','" +
    element.lega +        "','" +
    element.ilosc_leg +        "','" +
    element.ilosc_stron +        "','" +
    element.format_x +        "','" +
    element.format_y +        "','" +
    element.papier_id +        "','" +
    element.papier_postac_id +        "','" +
    element.papier_info +        "','" +
    element.arkusz_szerokosc +        "','" +
    element.arkusz_wysokosc +        "','" +
    element.naklad +        "','" +
    element.uwagi +        "'," +
    element.etap +        "," +
    element.stan +        "," +
    element.status +        "); ";

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
  zapiszTechnologieInsertElementy
    
}
 