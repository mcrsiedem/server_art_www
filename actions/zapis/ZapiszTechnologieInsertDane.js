const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const zapiszTechnologieInsertDane = (req,res) =>{
  let promises = [];
  let daneTech = req.body[0]



  var sql =   "INSERT INTO artdruk.technologie (nr,rok,tytul,firma_id,klient_id,zamowienie_id,autor_id,uwagi,opiekun_id,data_przyjecia,data_spedycji,data_materialow,stan,status,etap) "+
  "values ('" + daneTech.nr + "','" + daneTech.rok + "','" + daneTech.tytul + "','" + daneTech.firma_id + "','" + daneTech.klient_id + "','" + daneTech.zamowienie_id + "','" + daneTech.autor_id + "','" + daneTech.uwagi + "','" + daneTech.opiekun_id + "'," +ifNoDateSetNull( daneTech.data_przyjecia) + "," +ifNoDateSetNull( daneTech.data_spedycji) + "," + ifNoDateSetNull(daneTech.data_materialow) + "," + daneTech.stan + "," + daneTech.status + "," + daneTech.etap + "); ";

  promises.push(     new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
    if (err) {
        resolve([{zapis: false},err]);               
    } else {
        // resolve([results,"ok arkusz"])
        resolve([{zapis: true},{technologia_id:results.insertId}])
    }
});
})) 



  Promise.all(promises).then((data) => res.status(201).json(data));
}

module.exports = {
  zapiszTechnologieInsertDane
    
}
 