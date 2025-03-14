const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const zapiszTechnologieInsertProcesyElementow = (req,res) =>{



  let procesyElementow = req.body[0]

  let promises = [];



  //------------------------------
  for (let procesElementu of procesyElementow) {
    var sql =
    "INSERT INTO artdruk.technologie_procesy_elementow (id,indeks,technologia_id,zamowienie_id,produkt_id,element_id,front_ilosc,front_kolor,back_ilosc,back_kolor,predkosc,narzad,mnoznik,nazwa,nazwa_id,rodzaj,typ,obszar,wykonczenie,proces_id,procesor_domyslny) " +
    "values ('" +
    procesElementu.id +  "','" +
    procesElementu.indeks +        "','" +
    procesElementu.technologia_id +        "','" +
    procesElementu.zamowienie_id +        "','" +
    procesElementu.produkt_id +        "','" +
    procesElementu.element_id +        "','" +
    procesElementu.front_ilosc +        "','" +
    procesElementu.front_kolor +        "','" +
    procesElementu.back_ilosc +        "','" +
    procesElementu.back_kolor+        "','" +
    procesElementu.predkosc +        "','" +
    procesElementu.narzad +        "','" +
    procesElementu.mnoznik +        "','" +
    procesElementu.nazwa +        "','" +
    procesElementu.nazwa_id +        "','" +
    procesElementu.rodzaj +        "','" +
    procesElementu.typ +        "','" +
    procesElementu.obszar +        "','" +
    procesElementu.wykonczenie +        "','" +
    procesElementu.proces_id +        "','" +
    procesElementu.procesor_domyslny +        "'); ";

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
  zapiszTechnologieInsertProcesyElementow
    
}
 