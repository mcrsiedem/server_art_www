const connection = require("../db/mysql");


class ProduktyActions {

    updateProdukty(req,res){
        const id = req.body.id;
        const kolumna = req.body.kolumna;
        const value = req.body.value;
        var sql = "update produkty set " + kolumna + " = '" + value + "' where id="+id;
    
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record update ");
        res.status(201).json(result);
    });}

    updateProduktyByIdZleceniaAndTyp(req,res){
        const idzlecenie = req.body.idzlecenie;
        const kolumna = req.body.kolumna;
        const value = req.body.value;
        const typ = req.body.typ;
        var sql = "update produkty set " + kolumna + " = '" + value + "' where ID_zlecenia='" + idzlecenie + "' and Typ='" + typ + "'";
    
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record update ");
        res.status(201).json(result);
    });}

    getProduktyById(req,res){
        const idzlecenia = req.params['idzlecenia']
        var sql  = "select id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    nrZlecenia ,    rokZlecenia ,    klient ,    praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    przeloty ,    status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    dataCtp from produkty where (Maszyna='H1' or Maszyna='XL' or Maszyna='H3') and ID_zlecenia = '" + idzlecenia+ "' ORDER BY Typ ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });}

    updateProduktyCzasDruk(req,res){

        const id = req.body.id;
        const czas = req.body.czas;
        const kolumna= req.body.kolumna;
        const poczatekDruku= req.body.poczatekDruku;
        const maszyna= req.body.maszyna;
        const zmianaczasu= req.body.zmianaczasu;
        const kierunek= req.body.kierunek;

        console.log("poczatek druku "+poczatekDruku);
    
        var sql = "start transaction";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });

                var sql = "update produkty set " + kolumna + " = '" + czas + "' where id='" + id + "'";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });    

                var sql = "update produkty set KoniecDruku = '" + poczatekDruku + "' + interval '" + czas + "' minute  where id='" + id + "'";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });  


    
        if(kierunek == "zmniejszamy"){
               var sql = "update produkty set PoczatekDruku = PoczatekDruku - interval '" + zmianaczasu + "' minute, KoniecDruku = KoniecDruku - interval '" + zmianaczasu + "' minute  where PoczatekDruku > '" + poczatekDruku+ "' and Maszyna = '" + maszyna+ "'  ";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });
           }

           if(kierunek == "zwiekszamy"){
            var sql = "update produkty set PoczatekDruku = PoczatekDruku + interval '" + zmianaczasu + "' minute, KoniecDruku = KoniecDruku + interval '" + zmianaczasu + "' minute  where PoczatekDruku > '" + poczatekDruku+ "' and Maszyna = '" + maszyna+ "'  ";
             connection.query(sql, function (err, result) {
             if (err) throw err;
             });
        }
    
        var sql = "commit";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record update ");
            res.status(201).json(result);
            });
    }

}

module.exports = new ProduktyActions();