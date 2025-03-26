const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const zapiszTechnologieInsertLegiFragmenty = (req,res) =>{

  let legiFragmenty = req.body[0]
  let promises = [];



  //------------------------------
  for (let legaFragment of legiFragmenty) {
    var sql =
    "INSERT INTO artdruk.technologie_legi_fragmenty(id,indeks,technologia_id,zamowienie_id,element_id,fragment_id,arkusz_id,lega_id,nr_legi,naklad,oprawa_id,typ,wersja) " +
    "values ('" +
    legaFragment.id +  "','" +
    legaFragment.indeks +        "','" +
    legaFragment.technologia_id +        "','" +
    legaFragment.zamowienie_id +        "','" +
    legaFragment.element_id +        "','" +
    legaFragment.fragment_id +        "','" +
    legaFragment.arkusz_id +        "','" +
    legaFragment.lega_id +        "','" +
    legaFragment.nr_legi +        "','" +
    legaFragment.naklad +        "','" +
    legaFragment.oprawa_id +        "','" +
    legaFragment.typ +        "','" +
    legaFragment.wersja +        "'); ";

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
  zapiszTechnologieInsertLegiFragmenty
    
}
 