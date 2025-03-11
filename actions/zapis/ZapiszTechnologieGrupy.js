const connection = require("../mysql");

function zapiszTechnologieGrupy(req,res){

  let grupa = req.body
  var sql = "begin";
  connection.query(sql, function (err, result) {
  if (err) throw err;
  });

              let czas = grupa.czas;

              let poczatek ="select case when (select max(koniec) from artdruk.technologie_grupy_wykonan where procesor_id =  "+ grupa.procesor_id +") is null then now() else (select max(koniec) from artdruk.technologie_grupy_wykonan where procesor_id = "+ grupa.procesor_id +") END "
              let koniec =" (select case when (select max(koniec) from artdruk.technologie_grupy_wykonan where procesor_id =  "+ grupa.procesor_id +") is null then now() + interval " + czas + " minute else (select max(koniec) + interval " + czas + " minute from artdruk.technologie_grupy_wykonan where procesor_id = "+ grupa.procesor_id +") END) "

      var sql =
        "INSERT INTO artdruk.technologie_grupy_wykonan(poczatek,id,indeks,technologia_id,mnoznik,czas,koniec,narzad,nazwa,predkosc,proces_id,procesor_id,element_id,status,stan,uwagi) " +
        " " +
        poczatek +  ",'" +
        grupa.id +  "','" +
        grupa.indeks +        "','" +
        grupa.technologia_id +        "','" +
        grupa.mnoznik +        "','" +
        grupa.czas +        "'," +
         koniec +        ",'" +
        grupa.narzad +        "','" +
        grupa.nazwa +        "','" +
        grupa.predkosc +        "','" +
        grupa.proces_id +        "','" +
        grupa.procesor_id +        "','" +
        grupa.element_id +        "','" +
        grupa.status +        "','" +
        grupa.stan +        "','" +
        grupa.uwagi +        "'; ";
      connection.query(sql, function (err, result) {
          if (err){ connection.query("rollback ", function (err, result) {   throw err; });
          //  res.status(203).json(err) 
          
          
          } 
      });
         


    var sql = "commit";
connection.query(sql, function (err, result) {
  if (err){ connection.query("rollback ", function (err, result) {   });  } 
// console.log("Zapis: Gryup wykonań");
//   res.status(201).json([{zapis:"OK"}]);
});
}

module.exports = {
  zapiszTechnologieGrupy
    
}
 