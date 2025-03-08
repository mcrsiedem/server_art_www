const connection = require("../mysql");

function zapiszTechnologieWykonania(req,res){

  let wykonanie = req.body
  var sql = "begin";
  connection.query(sql, function (err, result) {
  if (err) throw err;
  });
      var sql =
        "INSERT INTO artdruk.technologie_wykonania(id,indeks,technologia_id, grupa_id,element_id,arkusz_id,typ_elementu,nazwa,naklad,poczatek,czas,koniec,narzad,predkosc,mnoznik,proces_id,procesor_id,status,stan,uwagi) " +
        "values ('" +
        wykonanie.id +  "','" +
        wykonanie.indeks +        "','" +
        wykonanie.technologia_id +        "','" +
        wykonanie.grupa_id +        "','" +
        wykonanie.element_id +        "','" +
        wykonanie.arkusz_id +        "','" +
        wykonanie.typ_elementu +        "','" +
        wykonanie.nazwa +        "','" +
        wykonanie.naklad +        "','" +
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
      connection.query(sql, function (err, result) {
        if (err) throw err;
      });
  
    var sql = "commit";
connection.query(sql, function (err, result) {
  if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
console.log("Zapis: wykonania ");
  res.status(201).json([{zapis:"OK"}]);
});
}

module.exports = {
  zapiszTechnologieWykonania
    
}
 