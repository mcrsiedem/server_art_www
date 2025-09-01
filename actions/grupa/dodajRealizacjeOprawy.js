const connection = require("../mysql");

const dodajRealizacjeOprawy = (req, res) => {
  let row = req.body;
 let id;

  // let koniec = data[0][0]
  // let kierunek = data[0][1] // dodaj - odejmij
  // let roznica_czasu = data[0][2] // różnica miedzy starym czasem a nowym

  // let rowGrupa = data[1] // rowGrupa  - wszystko nowe, tylko stary poczatek i koniec

  
  let data=[row.id,row.technologia_id,row.zamowienie_id,row.id,row.oprawa_id,row.naklad,row.proces_id,row.procesor_id]
  console.log(data)
      var sql =   "INSERT INTO artdruk.technologie_wykonania_oprawa (id,technologia_id,zamowienie_id, grupa_id,oprawa_id,naklad,proces_id,procesor_id) values (?,?,?,?,?,?,?,?); ";
      connection.execute(sql, data,function (err, result) {     
          if (err) throw err;     
        id = result.insertId
        });
    

    var sql = "commit"
connection.query(sql, function (err, result) {
    if (err) throw err
        res.status(200).json({status:"OK",insertId : id })  
 })

     }


module.exports = {
  dodajRealizacjeOprawy
};
