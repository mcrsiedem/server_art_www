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

    updateProduktyDataCTP(req,res){
        // wstawia wstawia now() do DataCTP przy dopisywaniu ilość zaświeconych blach
        const id = req.body.id;
        var sql = "update produkty set DataCTP = now() where id="+id;
        connection.query(sql, function (err, result) {
        if (err) throw err;
        res.status(201).json(result);
    });}

    updateNaprawCzas(req,res){
        const id = req.body.id;
        const poczatekdruku = req.body.poczatekdruku;
        const koniecdruku = req.body.koniecdruku;

        var sql = "update produkty set PoczatekDruku = '" + poczatekdruku + "', KoniecDruku = '" + koniecdruku + "'  where id='" + id + "'";
    
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

    updateProduktyByIdZlecenia(req,res){
        const idzlecenie = req.body.idzlecenie;
        const kolumna = req.body.kolumna;
        const value = req.body.value;
       
        var sql = "update produkty set " + kolumna + " = '" + value + "' where ID_zlecenia='" + idzlecenie + "'";
    
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
    });
    }
    getProduktyAllH1XLH3(req,res){
        const idzlecenia = req.params['idzlecenia']
        var sql  = "select id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    nrZlecenia ,    rokZlecenia ,    klient ,    praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    przeloty ,    status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    dataCtp from produkty where (Maszyna='H1' or Maszyna='XL' or Maszyna='H3')  ORDER BY Typ ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });
    }

    getProduktyAllnieoddane(req,res){
        var sql  = "select id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    nrZlecenia ,    rokZlecenia ,    klient ,    praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    przeloty ,    status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    dataCtp from produkty where (Maszyna='H1' or Maszyna='XL' or Maszyna='H3') and Status !='Oddane'  ORDER BY Typ ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });
    }

    getProduktyByIdZleceniAndTyp(req,res){
        const idzlecenia = req.params['idzlecenia']
        const typ = req.params['idzlecenia']

        if(typ != "null"){
        var sql  = "select id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    nrZlecenia ,    rokZlecenia ,    klient ,    praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    przeloty ,    status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    dataCtp from produkty where ID_zlecenia = '" + idzlecenia+ "' and Typ = '" + typ + "' ORDER BY Typ ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
                                        });
        }

        if(typ == "null"){
            var sql  = "select id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    nrZlecenia ,    rokZlecenia ,    klient ,    praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    przeloty ,    status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    dataCtp from produkty where ID_zlecenia = '" + idzlecenia+ "' and Typ != 'Sep' ORDER BY Typ ASC";
            connection.query(sql, function (err, doc) {
            if (err) throw err;
            res.status(200).json(doc);
                                            });
            }

    }


    updateProduktyCzasDruk(req,res){

        const id = req.body.id;
        const czas = req.body.czas;
        const kolumna= req.body.kolumna;
        const poczatekDruku= req.body.poczatekDruku;
        const maszyna= req.body.maszyna;
        const zmianaczasu= req.body.zmianaczasu;
        const kierunek= req.body.kierunek;

      //  console.log("poczatek druku "+maszyna);
    
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
    //-----------Falcowanie
    loadFalcowanie(req,res){
        
        var sql  = "select id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    nrZlecenia ,    rokZlecenia ,    klient ,    praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    ROUND((Przeloty * (Legi/Arkusze)),0) as przeloty ,    status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    dataCtp from produkty where LegiRodzaj != '0'  ORDER BY Spedycja ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
                                                });
       

   
    }
    //-------------Okładki
    loadOkladki(req,res){
        const view = req.params['view']

        if(view == "All"){
        var sql  = "select id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    nrZlecenia ,    rokZlecenia ,    klient ,    praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    przeloty ,    status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    dataCtp from produkty where ( Folia != '-' and Folia is not null and Folia !='Dyspersja błysk' and Folia !='Dyspersja mat') ORDER BY Spedycja ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
                                                });
        }

        if(view == "Wydrukowane"){
            var sql  = "select id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    nrZlecenia ,    rokZlecenia ,    klient ,    praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    przeloty ,    status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    dataCtp from produkty where ( Folia != '-' and Folia is not null and Folia !='Dyspersja błysk' and Folia !='Dyspersja mat') and Status = 'Wydrukowane' ORDER BY Spedycja ASC;";
            connection.query(sql, function (err, doc) {
            if (err) throw err;
            res.status(200).json(doc);
                                                    });
            }
    }

    //-------------Blachy
    loadBlachy(req,res){
        const view = req.params['view']

        if(view == "All"){
        var sql  = "select id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia ,    ifnull(Klient,'') as klient ,    ifnull(Praca,'') as praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    przeloty ,    status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    DATE_FORMAT(`DataCTP`, '%Y-%m-%d %H:%i:%s') AS `dataCtp` from produkty where typ != 'Przerwa' ORDER BY Kolejnosc ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
                                                });
        }

    }

    postBlachyLicznik(req,res){
        const kolejnosc = req.body.kolejnosc;

       var sql = "start transaction";
        connection.query(sql, function (err, result) {
        if (err) throw err;  });

        var sql = "update produkty set Kolejnosc = Kolejnosc+1 where Kolejnosc > '" + kolejnosc + "'";
        connection.query(sql, function (err, result) {
        if (err) throw err;
                                                    });
        var sql = "INSERT INTO produkty  (ID,Kolejnosc,Praca,DataCTP,Typ,Maszyna)  SELECT MAX(ID)+1,'" + kolejnosc + "'+1,CONCAT('--------  ZAŚWIECONE  od  ',now()),now(),'Licznik','L' from produkty";
        connection.query(sql, function (err, result) {
        if (err) throw err;
                                                    });
        var sql = "commit";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Licznik dodany! ");
       res.status(201).json(result);
    });
}

//---------
postBlachyKopia(req,res){
    const kolejnosc = req.body.kolejnosc;
    const ID_zlecenia = req.body.ID_zlecenia;
    const maszyna = req.body.maszyna;
    const nrzlecenia = req.body.nrzlecenia;
    const rokzlecenia = req.body.rokzlecenia;
    const klient = req.body.klient;
    const praca = req.body.praca;

   var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;  });

    var sql = "update produkty set Kolejnosc = Kolejnosc+1 where Kolejnosc > '" + kolejnosc + "'";
    connection.query(sql, function (err, result) {
    if (err) throw err;
                                                });
    var sql = "INSERT INTO produkty  (ID,Kolejnosc,ID_zlecenia,Typ,Maszyna,NrZlecenia,RokZlecenia,Klient,Praca,Arkusze)  SELECT MAX(ID)+1,'" + kolejnosc + "'+1,'" + ID_zlecenia + "','Part',CONCAT('P','" + maszyna + "'),'" + nrzlecenia + "','" + rokzlecenia + "','" + klient + "','" + praca + "','0' from produkty";
    connection.query(sql, function (err, result) {
    if (err) throw err;
                                                });
    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Kopia blachy! ");
   res.status(201).json(result);
});
}

//-----------------
deleteBlachy(req,res){
    const id = req.body.id;
    const kolejnosc = req.body.kolejnosc;

    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;  });

    var sql = "DELETE FROM produkty WHERE ID =" +id+ "";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record delete ");
      //  res.status(204).json(result);
    });

    var sql = "update produkty set  Kolejnosc=Kolejnosc -1  WHERE Kolejnosc >" +kolejnosc+ "";
            connection.query(sql, function (err, result) {
            if (err) throw err;

    });

    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Skasoway licznik albo coś doświecane! ");
   res.status(201).json(result);
                        });
}

//-------------
updateKolejnoscZgoryNaDol(req,res){
    const k1_drag = req.body.k1_drag;
    const k2_drop = req.body.k2_drop;
    const widok = req.body.widok;
    const id_drag = req.body.id_drag;

   
    connection.query("start transaction", function (err, result) { if (err) throw err;  });

        if(widok=="Oprawa"){
            var sql = "update zlecenia set KolejnoscOprawa = KolejnoscOprawa+1 where KolejnoscOprawa>'" + k2_drop + "'";
            connection.query(sql, function (err, result) {    if (err) throw err;  });

            var sql = "update zlecenia set KolejnoscOprawa = '" + k2_drop + "'+1 where id='" + id_drag + "'";
            connection.query(sql, function (err, result) {    if (err) throw err;  });

            var sql = "update zlecenia  set KolejnoscOprawa = KolejnoscOprawa-1 where KolejnoscOprawa>'" + k1_drag + "'";
            connection.query(sql, function (err, result) {    if (err) throw err;  });
        }

        
        if(widok=="Blachy"){
            var sql= "update produkty set Kolejnosc = Kolejnosc+1 where Kolejnosc>'" + k2_drop + "'";
            connection.query(sql, function (err, result) {    if (err) throw err;  });

            var sql = "update produkty set Kolejnosc = '" + k2_drop + "'+1 where id='" + id_drag + "'";
            connection.query(sql, function (err, result) {    if (err) throw err;  });

            var sql = "update produkty  set Kolejnosc = Kolejnosc-1 where Kolejnosc>'" + k1_drag + "'";
            connection.query(sql, function (err, result) {    if (err) throw err;  });
        }
    
    connection.query("commit", function (err, result) { if (err) throw err;  console.log("z gory do dolu ");  res.status(201).json(result); });

}

updateKolejnoscZdoluNaGore(req,res){
    const k_drag = req.body.k_drag;
    const k_drop = req.body.k_drop;
    const widok = req.body.widok;
    const id_drag = req.body.id_drag;

   
    connection.query("start transaction", function (err, result) { if (err) throw err;  });

        if(widok=="Oprawa"){
            var sql = "update zlecenia set KolejnoscOprawa = KolejnoscOprawa+1 where KolejnoscOprawa>='" + k_drop + "'";
            connection.query(sql, function (err, result) {    if (err) throw err;  });

            var sql = "update zlecenia set KolejnoscOprawa = '" + k_drop + "' where id='" + id_drag + "'";
            connection.query(sql, function (err, result) {    if (err) throw err;  });

        }

        
        if(widok=="Blachy"){
            var sql= "update produkty set Kolejnosc = Kolejnosc+1 where Kolejnosc>='" + k_drop + "'";
            connection.query(sql, function (err, result) {    if (err) throw err;  });

            var sql  = "update produkty set Kolejnosc = '" + k_drop + "' where id='" + id_drag + "'";
            connection.query(sql, function (err, result) {    if (err) throw err;  });
        }
    
    connection.query("commit", function (err, result) { if (err) throw err;  console.log("z dolu na gore ");  res.status(201).json(result); });

}


}

module.exports = new ProduktyActions();