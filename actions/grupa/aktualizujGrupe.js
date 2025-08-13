const connection = require("../mysql");

const aktualizujGrupe = (req, res) => {
  let data = req.body;


  let koniec = data[0][0]
  let kierunek = data[0][1] // dodaj - odejmij
  let roznica_czasu = data[0][2] // różnica miedzy starym czasem a nowym

  let rowGrupa = data[1] // rowGrupa  - wszystko nowe, tylko stary poczatek i koniec
   let rowGrupa_global_id = data[1].global_id 
   let rowGrupa_predkosc = data[1].predkosc 
   let rowGrupa_narzad = data[1].narzad 
   let rowGrupa_przeloty = data[1].przeloty
   let rowGrupa_ilosc_narzadow = data[1].ilosc_narzadow
  let wykonania = data[2] 

    //nowy czas grupy
    let val=[rowGrupa_global_id,kierunek,roznica_czasu]
    var sql = "select artdruk.zmien_czas_trwania_grupy_minuty(?,?,?) as procesor_id";
    connection.execute(sql, val ,function (err, result) { if (err) throw err });

    // aktualizacja samej grupy
    let dane=[rowGrupa_predkosc,rowGrupa_narzad,rowGrupa_przeloty,rowGrupa_ilosc_narzadow,rowGrupa_global_id]
    var sql =   "update  artdruk.technologie_grupy_wykonan set  predkosc =?, narzad =?, przeloty =?, ilosc_narzadow=? where global_id =?"
    connection.execute(sql, dane,function (err, result) {       if (err) throw err;       });


    // aktualizacja wykonan
      for(let row of wykonania.filter(x => x.update == true && x.insert != true) ){
            let data2=[row.indeks,row.nazwa_wykonania,row.nazwa,row.naklad,row.przeloty,row.czas,row.narzad,row.predkosc,row.global_id]

      var sql =   "update artdruk.technologie_wykonania set  indeks=?,nazwa_wykonania=?,nazwa=?,naklad=?,przeloty=?,czas=?,narzad=?,predkosc=? where global_id =?"
      connection.execute(sql, data2,function (err, result) {        if (err) throw err;       });
      }

      
      for(let row of wykonania.filter(x => x.insert == true && x.delete != true) ){
      let data=[row.id,row.indeks,row.technologia_id,row.zamowienie_id,row.nazwa_wykonania,row.grupa_id,row.element_id,row.arkusz_id,row.typ_elementu,row.nazwa,row.naklad,row.przeloty,row.poczatek,row.czas,row.koniec,row.narzad,row.predkosc,row.mnoznik,row.proces_id,row.procesor_id,row.status,row.stan,row.uwagi]
      var sql =   "INSERT INTO artdruk.technologie_wykonania (id,indeks,technologia_id,zamowienie_id,nazwa_wykonania, grupa_id,element_id,arkusz_id,typ_elementu,nazwa,naklad,przeloty,poczatek,czas,koniec,narzad,predkosc,mnoznik,proces_id,procesor_id,status,stan,uwagi) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?); ";
      connection.execute(sql, data,function (err, result) {       if (err) throw err;       });
      }

      for(let row of wykonania.filter(x => x.delete == true && x.insert != true) ){
      let data=[row.global_id]
      var sql =   "DELETE from artdruk.technologie_wykonania where global_id=?";
      connection.execute(sql, data,function (err, result) {       if (err)throw err;       });
      } 

    

    var sql = "commit"
connection.query(sql, function (err, result) {
    if (err) throw err
        res.status(200).json("OK")  
 })

     }


module.exports = {
  aktualizujGrupe
};
