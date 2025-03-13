const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const zapiszTechnologieInsertArkusze = (req,res) =>{



  let arkusze = req.body[0]

  let promises = [];



  //------------------------------
  for (let arkusz of arkusze) {
      var sql =
      "INSERT INTO artdruk.technologie_arkusze (id,indeks,technologia_id,typ_elementu,rodzaj_arkusza,element_id,ilosc_stron,ilosc_leg,naklad,nadkomplet,papier_id,nr_arkusza,arkusz_szerokosc,arkusz_wysokosc,uwagi) " +
      "values (" +
      arkusz.id +  ",'" +
      arkusz.indeks +        "','" +
      arkusz.technologia_id +        "','" +
      arkusz.typ_elementu +        "','" +
      arkusz.rodzaj_arkusza +        "','" +
      arkusz.element_id +        "','" +
      arkusz.ilosc_stron +        "','" +
      arkusz.ilosc_leg+        "','" +
      arkusz.naklad +        "','" +
      arkusz.nadkomplet +        "'," +
      arkusz.papier_id +        ",'" +
      arkusz.nr_arkusza +        "','" +
      arkusz.arkusz_szerokosc +        "','" +
      arkusz.arkusz_wysokosc +        "','" +
      arkusz.uwagi +        "'); ";

      promises.push(     new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {
        if (err) {
 
            resolve([err]);               
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
  zapiszTechnologieInsertArkusze
    
}
 