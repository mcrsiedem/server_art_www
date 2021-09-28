const connection = require("../db/mysql");


class ZleceniaActions {

    getZlecenia(req,res){
        var sql = "SELECT id,utworzono, zmodyfikowano, kolejnosc,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,klient,praca,naklad , formatPapieru ,  oprawa ,  oprawaCzas , oprawaPredkosc ,  folia ,  DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` , arkusze , legi , legiRodzaj ,  przeloty ,  status , uwagi ,falcPredkosc ,  falcCzas ,  kolejnoscOprawa ,  srodek ,  okladka FROM zlecenia ORDER BY Utworzono ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}

    updateZlecenieOneValue(req,res){
        const id = req.body.id;
        const kolumna = req.body.kolumna;
        const value = req.body.value;
        var sql = "update zlecenia set " + kolumna + " = '" + value + "' where id="+id;
    
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record update ");
        res.status(201).json(result);
    });}


}

module.exports = new ZleceniaActions();