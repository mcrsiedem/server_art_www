const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const zapiszTechnologieInsertLegi = (req,res) =>{

  let legi = req.body[0]
  let promises = [];



  //------------------------------
  for (let lega of legi) {
    var sql =
    "INSERT INTO artdruk.technologie_legi(id,indeks,technologia_id,typ_elementu,rodzaj_legi,element_id,arkusz_id,ilosc_stron,naklad,nr_legi,uwagi) " +
    "values ('" +
    lega.id +  "','" +
    lega.indeks +        "','" +
    lega.technologia_id +        "','" +
    lega.typ_elementu +        "','" +
    lega.rodzaj_legi +        "','" +
    lega.element_id +        "','" +
    lega.arkusz_id +        "','" +
    lega.ilosc_stron +        "','" +
    lega.naklad +        "','" +
    lega.nr_legi +        "','" +
    lega.uwagi +        "'); ";

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
  zapiszTechnologieInsertLegi
    
}
 