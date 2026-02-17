const { connection, pool } = require("../mysql");

const ZamowieniaInfo = (req, res) => {
  let zamowienia = req.body;
  // sumuje przeloty druku i falocowania z przeslanej tablicy zamowień
  // czyli np wszystkie wsipy

//   let technologia_id = wykonanieRow.technologia_id;

let suma_przelotow_druk =0;
let suma_przelotow_falc =0;
let suma_przelotow_druk_zakonczone =0;
let suma_przelotow_falc_zakonczone =0;
let suma_nakladow =0;
let suma_nakladow_zeszyt =0;
let suma_nakladow_klejona =0;

// console.log(zamowienia)

  for( let zamowienie of zamowienia){


 var sql = " SELECT sum(przeloty) as przeloty FROM artdruk.view_technologie_wykonania where proces_nazwa_id = 1 and zamowienie_id = "+ zamowienie.id 
 connection.query(sql, function (err, result) {
  suma_przelotow_druk = suma_przelotow_druk + parseInt(result[0].przeloty || 0)
    // console.log(result[0].przeloty)
    if (err) console.log(err)
    });

 var sql = " SELECT sum(przeloty) as przeloty FROM artdruk.view_technologie_wykonania where proces_nazwa_id = 3 and zamowienie_id = "+ zamowienie.id 
 connection.query(sql, function (err, result) {
  suma_przelotow_falc = suma_przelotow_falc + parseInt(result[0].przeloty || 0)
    // console.log(result[0].przeloty)
    if (err) console.log(err)
    });


     var sql = " SELECT sum(przeloty) as przeloty FROM artdruk.view_technologie_wykonania where proces_nazwa_id = 1 and status = 4 and zamowienie_id = "+ zamowienie.id 
 connection.query(sql, function (err, result) {
  suma_przelotow_druk_zakonczone = suma_przelotow_druk_zakonczone + parseInt(result[0].przeloty || 0)
    // console.log(result[0].przeloty)
    if (err) console.log(err)
    });

 var sql = " SELECT sum(przeloty) as przeloty FROM artdruk.view_technologie_wykonania where proces_nazwa_id = 3 and status = 4 and zamowienie_id = "+ zamowienie.id 
 connection.query(sql, function (err, result) {
  suma_przelotow_falc_zakonczone = suma_przelotow_falc_zakonczone + parseInt(result[0].przeloty || 0)
    // console.log(result[0].przeloty)
    if (err) console.log(err)
    });

 var sql = " SELECT sum(naklad) as naklad FROM artdruk.zamowienia_produkty where zamowienie_id = "+ zamowienie.id 
 connection.query(sql, function (err, result) {
  suma_nakladow = suma_nakladow + parseInt(result[0].naklad || 0)
    // console.log(result[0].przeloty)
    if (err) console.log(err)
    });




 var sql = " SELECT sum(naklad) as naklad FROM artdruk.zamowienia_produkty where oprawa  between 54 and 59 and zamowienie_id = "+ zamowienie.id 
 connection.query(sql, function (err, result) {
  suma_nakladow_zeszyt = suma_nakladow_zeszyt + parseInt(result[0].naklad || 0)
    // console.log(result[0].przeloty)
    if (err) console.log(err)
    });

 var sql = " SELECT sum(naklad) as naklad FROM artdruk.zamowienia_produkty where oprawa  between 50 and 52 and zamowienie_id = "+ zamowienie.id 
 connection.query(sql, function (err, result) {
  suma_nakladow_klejona = suma_nakladow_klejona + parseInt(result[0].naklad || 0)
    // console.log(result[0].przeloty)
    if (err) console.log(err)
    });


  }


    var sql = "commit"
connection.query(sql, function (err, result) {
    if (err) console.log(err)
        // res.status(200).json([suma_przelotow_druk,suma_przelotow_falc,suma_przelotow_druk_zakonczone,suma_przelotow_falc_zakonczone])  
        res.status(200).json({przeloty_druk:suma_przelotow_druk,przeloty_falc: suma_przelotow_falc, przeloty_druk_zakonczone:suma_przelotow_druk_zakonczone, przeloty_falc_zakonczone:suma_przelotow_falc_zakonczone,naklad:suma_nakladow,naklad_zeszyt:suma_nakladow_zeszyt,naklad_klejona:suma_nakladow_klejona})  

 })

  
};

module.exports = {
  ZamowieniaInfo,
};
