const connection = require("../mysql");

const aktualizujGrupe = (req, res) => {
  let data = req.body;


  let koniec = data[0][0]
  let kierunek = data[0][1] // dodaj - odejmij
  let roznica_czasu = data[0][2] // różnica miedzy starym czasem a nowym

  let rowGrupa = data[1] // rowGrupa  - wszystko nowe, tylko stary poczatek i koniec
   let rowGrupa_global_id = data[1].global_id 
  let wykonania = data[2] // różnica miedzy starym czasem a nowym


    let val=[rowGrupa_global_id,kierunek,roznica_czasu]
    var sql = "select artdruk.zmien_czas_trwania_grupy_minuty(?,?,?) as procesor_id";
    connection.execute(sql, val ,function (err, result) { if (err) throw err });

    
  // rozepchać inne grupy
  // update grupy
  // update wykonan 



    var sql = "commit"
connection.query(sql, function (err, result) {
    if (err) throw err
        // res.status(200).json({przeloty_druk:suma_przelotow_druk,przeloty_falc: suma_przelotow_falc, przeloty_druk_zakonczone:suma_przelotow_druk_zakonczone, przeloty_falc_zakonczone:suma_przelotow_falc_zakonczone,naklad:suma_nakladow})  
        res.status(200).json("OK")  

 })

  
};

module.exports = {
  aktualizujGrupe,
};
