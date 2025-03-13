const connection = require("../mysql");

function zapiszTechnologieProcesyElementow(req,res){

  let procesElementu = req.body
  var sql = "begin";
  connection.query(sql, function (err, result) {
  if (err) throw err;
  });
  var sql =
  "INSERT INTO artdruk.technologie_procesy_elementow (id,indeks,technologia_id,zamowienie_id,produkt_id,element_id,front_ilosc,front_kolor,back_ilosc,back_kolor,predkosc,narzad,mnoznik,nazwa,nazwa_id,rodzaj,typ,obszar,wykonczenie,procesor_domyslny) " +
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
  procesElementu.procesor_domyslny +        "'); ";
connection.query(sql, function (err, result) {
    if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
});
  
    var sql = "commit";
connection.query(sql, function (err, result) {
  if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
console.log("Zapis: Proces Elementu");
  res.status(201).json([{zapis:"OK"}]);
});
}

module.exports = {
  zapiszTechnologieProcesyElementow
    
}
 