const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const zapiszTechnologieInsertProcesyElementow = (req,res) =>{



  let procesyElementow = req.body[0]

  let promises = [];


  
for (let procesElementu of procesyElementow) {
    var sql =
    "INSERT INTO artdruk.technologie_procesy_elementow (id,indeks,technologia_id,zamowienie_id,produkt_id,element_id,ilosc_uzytkow,front_ilosc,front_kolor,back_ilosc,back_kolor,info,nazwa_id,proces_id) " +
    "values ('" +
    procesElementu.id +  "','" +
    procesElementu.indeks +        "','" +
    procesElementu.technologia_id +        "','" +
    procesElementu.zamowienie_id +        "','" +
    procesElementu.produkt_id +        "','" +
    procesElementu.element_id +        "','" +
    procesElementu.ilosc_uzytkow +        "','" +
    procesElementu.front_ilosc +        "','" +
    procesElementu.front_kolor +        "','" +
    procesElementu.back_ilosc +        "','" +
    procesElementu.back_kolor+        "','" +
    procesElementu.info+        "','" +
    procesElementu.nazwa_id +        "','" +
    procesElementu.proces_id +        "'); ";


      promises.push(     new Promise((resolve, reject) => {

        if (procesyElementow.length != 0) {
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





  //------------------------------
  




  Promise.all(promises).then((data) => res.status(201).json(data));
}

module.exports = {
  zapiszTechnologieInsertProcesyElementow
    
}
 