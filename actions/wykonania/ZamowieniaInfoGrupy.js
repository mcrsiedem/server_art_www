const { connection, pool } = require("../mysql");

const ZamowieniaInfoGrupy = (req, res) => {
  let grupy = req.body;
  // sumuje przeloty druku i falocowania z przeslanej tablicy zamowień
  // czyli np wszystkie wsipy

//   let technologia_id = wykonanieRow.technologia_id;

let suma_przelotow =0;

// console.log(grupy)

  for( let grupa of grupy){


 var sql = " SELECT sum(przeloty) as przeloty FROM artdruk.technologie_grupy_wykonan where global_id = "+ grupa.global_id
 connection.query(sql, function (err, result) {
  suma_przelotow = suma_przelotow + parseInt(result[0].przeloty || 0)
    if (err) console.log(err)
    });
  }


    var sql = "commit"
connection.query(sql, function (err, result) {
    if (err) console.log(err)
        res.status(200).json({suma_przelotow:suma_przelotow})  

 })

  
};

module.exports = {
  ZamowieniaInfoGrupy,
};
