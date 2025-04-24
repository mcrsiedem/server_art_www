const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const zapiszTechnologieInsertFragmenty = (req,res) =>{
  let promises = [];
  let fragmenty = req.body[0]



  for (let fragment of fragmenty.filter(x =>  x.delete != true)) {
    var sql =
    "INSERT INTO artdruk.technologie_fragmenty (id,indeks,technologia_id,zamowienie_id,produkt_id,element_id,oprawa_id,typ,ilosc_stron,wersja,naklad,info) " +
    "values ('" +
    fragment.id +  "','" +
    fragment.indeks +        "','" +
    fragment.technologia_id +        "','" +
    fragment.zamowienie_id +        "','" +
    fragment.produkt_id +        "','" +
    fragment.element_id +        "','" +
    fragment.oprawa_id +        "','" +
    fragment.typ +        "','" +
    fragment.ilosc_stron +        "','" +
    fragment.wersja +        "','" +
    fragment.naklad +        "','" +
    fragment.info +        "'); ";

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
  zapiszTechnologieInsertFragmenty
    
}
 