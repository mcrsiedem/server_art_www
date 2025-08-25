const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const zapiszTechnologieInsertWykonania = (req,res) =>{



  let wykonania = req.body[0]

  let promises = [];

  // jeśli są
  
      //------------------------------
  for (let wykonanie of wykonania) {
    var sql =
    "INSERT INTO artdruk.technologie_wykonania(id,indeks,technologia_id,zamowienie_id,nazwa_wykonania, grupa_id,element_id,arkusz_id,typ_elementu,nazwa,naklad,przeloty,poczatek,czas,koniec,narzad,predkosc,mnoznik,proces_id,procesor_id,status,stan,uwagi) " +
    "values ('" +
    wykonanie.id +  "','" +
    wykonanie.indeks +        "','" +
    wykonanie.technologia_id +        "','" +
    wykonanie.zamowienie_id +        "','" +
    wykonanie.nazwa_wykonania +        "','" +
    wykonanie.grupa_id +        "','" +
    wykonanie.element_id +        "','" +
    wykonanie.arkusz_id +        "','" +
    wykonanie.typ_elementu +        "','" +
    wykonanie.nazwa +        "','" +
    wykonanie.naklad +        "','" +
    wykonanie.przeloty +        "','" +
    wykonanie.poczatek +        "','" +
    wykonanie.czas +        "','" +
    wykonanie.koniec +        "','" +
    wykonanie.narzad +        "','" +
    wykonanie.predkosc +        "','" +
    wykonanie.mnoznik +        "','" +
    wykonanie.proces_id +        "','" +
    wykonanie.procesor_id +        "','" +
    wykonanie.status +        "','" +
    wykonanie.stan +        "','" +
    wykonanie.uwagi +        "'); ";

      promises.push(     new Promise((resolve, reject) => {
        
        if (wykonania.length != 0) {
          connection.query(sql, (err, results) => {
            if (err) {
              resolve([{ zapis: false }, err]);
            } else {
              resolve([{ zapis: true }]);
            }
          });
        } else {
          resolve([{ zapis: true }]);
        }

    })) 

  }
  





  Promise.all(promises).then((data) => res.status(201).json(data));
}

module.exports = {
  zapiszTechnologieInsertWykonania
    
}
 