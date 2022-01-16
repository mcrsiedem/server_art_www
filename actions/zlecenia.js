const connection = require("../db/mysql");


class ZleceniaActions {

    // getZlecenia2(req,res){
    //     var sql = "SELECT id,utworzono, zmodyfikowano, kolejnosc,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,klient,praca,naklad , formatPapieru ,  oprawa ,  oprawaCzas , oprawaPredkosc ,  folia ,  DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` , arkusze , legi , legiRodzaj ,  przeloty ,  status , uwagi ,falcPredkosc ,  falcCzas ,  kolejnoscOprawa ,  srodek ,  okladka FROM zlecenia ORDER BY Utworzono ASC;";
    //     connection.query(sql, function (err, doc) {
    //     if (err) throw err;
    //     //sconsole.log(doc);
    //     res.status(200).json(doc);
    // });}

    getZlecenia(req,res){

        var sql = "SELECT zlecenia.id,utworzono, zmodyfikowano,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia, "+
        "klient,praca,naklad , "+
        "(select oprawa from produkty where id_zlecenia =zlecenia.id and typ='Środek' limit 1) as oprawa ,  "+
        "(select sum(OprawaCzas) from produkty where id_zlecenia =zlecenia.id) as oprawaCzas , "+
        "(select max(OprawaPredkosc) from produkty where id_zlecenia =zlecenia.id) as oprawaPredkosc , "+
        "(select folia from produkty where id_zlecenia =zlecenia.id and typ='Okładka' limit 1) as folia ,  DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` , "+
        // "(select sum(arkusze) from produkty where id_zlecenia =zlecenia.id) as arkusze , "+
        // "(select sum(legi) from produkty where id_zlecenia =zlecenia.id and typ='Środek' limit 1) as legi , "+
        // "(select max(legiRodzaj) from produkty where id_zlecenia =zlecenia.id and typ='Środek' limit 1) as legiRodzaj ,  "+
        "(select sum(przeloty) from produkty where id_zlecenia =zlecenia.id) as przeloty , "+
        "statusGlowny.nazwa as status , uwagi , "+
        "(select max(FalcPredkosc) from produkty where id_zlecenia =zlecenia.id) as falcPredkosc , "+
        "(select sum(FalcCzas) from produkty where id_zlecenia =zlecenia.id) as falcCzas , "+
        "kolejnoscOprawa ,  statusSrodek.nazwa as srodek , statusOkladka.nazwa as okladka,statusInne.nazwa as inne "+
        "from zlecenia "+
        "left join statusy as statusGlowny on (select min(status) from produkty where id_zlecenia =zlecenia.id)  = statusGlowny.id "+
        "left join statusy as statusSrodek on (select min(status) from produkty where id_zlecenia =zlecenia.id and produkty.Typ='Środek')  = statusSrodek.id "+
        "left join statusy as statusOkladka on (select min(status) from produkty where id_zlecenia =zlecenia.id and produkty.Typ='Okładka')  = statusOkladka.id "+
        "left join statusy as statusInne on (select min(status) from produkty where id_zlecenia =zlecenia.id and (produkty.Typ!='Okładka' and produkty.Typ!='Środek'))  = statusInne.id "+
        " ORDER BY Utworzono ASC;";
        
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}



    getZleceniaNieoddane(req,res){
        var sql = "SELECT id,utworzono, zmodyfikowano, kolejnosc,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,klient,praca,naklad , formatPapieru ,  ifnull(Oprawa,'') as oprawa ,  ifnull(OprawaCzas,'') as oprawaCzas , oprawaPredkosc ,  folia ,  DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` , arkusze , legi , legiRodzaj ,  przeloty ,  status , uwagi ,falcPredkosc ,  falcCzas ,  kolejnoscOprawa ,  srodek ,  okladka FROM zlecenia where Status != 'Oddane' ORDER BY Utworzono ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });}


    getMaxNrZlecenia(req,res){
        var sql  = "SELECT  max(NrZlecenia)+1 as klient FROM zlecenia where RokZlecenia = YEAR(now()) ;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}

    getZlecenieById(req,res){
        const id = req.params['id']
        var sql =   "SELECT id,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,"+
                    "klient,praca,naklad , "+
                    "  DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,  uwagi "+
                    "     FROM zlecenia where id='"+id+"' ORDER BY Utworzono ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
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

    updateStatus(req,res){
        const id = req.body.id;
        const value = req.body.value;

        // const status = new Map();
        // status.set("Nieaktywne", "0");
        // status.set("Nowe", "1");
        // status.set("Pliki", "2");
        // status.set("Akcept", "3");
        // status.set("RIP", "4");
        // status.set("Zaświecone", "5");
        // status.set("Wydrukowane", "6");
        // status.set("Sfalcowane", "7");
        // status.set("Uszlachetnone", "8");
        // status.set("Oprawione", "9");
        // status.set("Oddane", "10");
        // status.set("Anulowane", "11");

        var sql = "start transaction";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });

                var sql = "update produkty set status= '" + value + "' where id="+id;
                connection.query(sql, function (err, result) {
                if (err) throw err;

                });

var sql = "commit";
connection.query(sql, function (err, result) {
if (err) throw err;
console.log("1 record update ");
res.status(201).json(result);
});



}

//--- update wszstykie statusy produktów dla danego zlecenia
updateStatusZlecenia(req,res){
    const idzlecenia = req.body.idzlecenia;
    const value = req.body.value;

            var sql = "update produkty set status= '" + value + "' where ID_zlecenia="+idzlecenia;
            connection.query(sql, function (err, result) {
            if (err) throw err;
            res.status(201).json(result);
            });



}
//---




    updateZlecenieAllValue(req,res){
        const id = req.body.id;
        const nr = req.body.nr;
        const rok = req.body.rok;
        const klient = req.body.klient;
        const praca = req.body.praca;
        const naklad = req.body.naklad;
        const spedycja = req.body.spedycja;


        var sql = "update zlecenia set  NrZlecenia='" + nr + "', RokZlecenia='" + rok + "', Klient='" + klient + "', Praca='" + praca + "', Naklad='" + naklad + "', Spedycja='" + spedycja + "'  where ID='"+id+"'";
    
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record update ");
        res.status(201).json(result);
    });}



    postZlecenie(req,res){

         const jsonParsed = JSON.parse(JSON.stringify(req.body))
        // console.log(jsonParsed.persons[0].city);
        // console.log(Object.keys(jsonParsed.persons).length);
        // console.log(req.body);
        // console.log(jsonParsed[0].oprawa);
    //    console.log(Object.keys(jsonParsed[1]).length);
    //    console.log(jsonParsed[1][0].folia);

        var sql = "start transaction";
        connection.query(sql, function (err, result) {
        if (err) throw err;  });

        var sql ="INSERT INTO zlecenia  (ID,KolejnoscOprawa,NrZlecenia,RokZlecenia,Klient,Praca,Naklad,Spedycja) SELECT MAX(ID)+1,(SELECT MAX(KolejnoscOprawa)+1),'" + jsonParsed[0].nr + "','" + jsonParsed[0].rok + "','"+ jsonParsed[0].klient + "','"+ jsonParsed[0].praca + "','"+ jsonParsed[0].naklad + "','"+ jsonParsed[0].spedycja + "' FROM zlecenia";
        connection.query(sql, function (err, result) {
        if (err) throw err; });

        var sql = "INSERT INTO historia (User,Kategoria,Event,ID_target,NrZlecenia,RokZlecenia,Klient,Praca,Typ,StatusStary,StatusNowy) values ('" + jsonParsed[0].user + "','Zlecenie','Dodanie zlecenia',(SELECT MAX(ID) from zlecenia),'" + jsonParsed[0].nr + "','" + jsonParsed[0].rok + "','" + jsonParsed[0].klient + "','" + jsonParsed[0].praca + "','Zlecenie','',''); ";
        connection.query(sql, function (err, result) {
        if (err) throw err; });

        for (let i = 0; i < Object.keys(jsonParsed[1]).length; i++) {
      
            var sql = "INSERT INTO produkty  (ID,Kolejnosc,Naklad,Spedycja,ID_Zlecenia,NrZlecenia,RokZlecenia,Klient,Status,Praca,Oprawa,Uwagi,Narzad,Folia,Przeloty,PredkoscDruku,Arkusze,Legi,LegiRodzaj,FalcCzas,FalcPredkosc,OprawaCzas,FormatPapieru,Maszyna,Typ,PoczatekDruku,CzasDruku,KoniecDruku) SELECT MAX(ID)+1,(SELECT MAX(Kolejnosc)+1),'" +jsonParsed[0].naklad+ "','" +jsonParsed[0].spedycja+ "', (select MAX(ID) from zlecenia) as ID_Zlecenia ,'"+ jsonParsed[0].nr + "','"+ jsonParsed[0].rok + "','"+ jsonParsed[0].klient + "',1,'"+ jsonParsed[1][i].praca + "','"+ jsonParsed[1][i].oprawa+ "','"+ jsonParsed[1][i].uwagi+ "','"+ jsonParsed[1][i].narzad+ "','"+ jsonParsed[1][i].folia+ "','"+ jsonParsed[1][i].przeloty+ "','"+ jsonParsed[1][i].predkoscDruku+ "','"+ jsonParsed[1][i].arkusze+ "','"+ jsonParsed[1][i].legi+ "','"+ jsonParsed[1][i].legiRodzaj+ "','"+ jsonParsed[1][i].falcCzas+ "','"+ jsonParsed[1][i].falcPredkosc+ "','"+ jsonParsed[1][i].oprawaCzas+ "','"+ jsonParsed[1][i].formatPapieru+ "','"+ jsonParsed[1][i].maszyna + "','"+ jsonParsed[1][i].typ + "', (select MAX(KoniecDruku) from produkty where maszyna='"+ jsonParsed[1][i].maszyna + "') as PoczatekDruku ,'"+ jsonParsed[1][i].czasDruku+ "',(select MAX(KoniecDruku) from produkty where maszyna='"+ jsonParsed[1][i].maszyna + "') + interval '"+ jsonParsed[1][i].czasDruku+ "' minute as KoniecDruku  FROM produkty";
            connection.query(sql, function (err, result) {
            if (err) throw err; });

            var sql = "INSERT INTO naswietlenia  (produkt_id,kolej,typ) select (SELECT MAX(id) from produkty) as id, (select MAX(kolej)+1 from naswietlenia) as kolej,'prime' ;";
            connection.query(sql, function (err, result) {
            if (err) throw err; });


          }

         

        var sql = "commit";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record insert ");
    res.status(200).json(result);
    });
        
    
}

deleteZlecenie(req,res){
        const idzlecenia = req.body.idzlecenia;
        const kolejnosc = req.body.kolejnosc;
        const kolejnoscoprawa = req.body.kolejnoscoprawa;
   

        var sql = "start transaction";
        connection.query(sql, function (err, result) {
        if (err) throw err;  });

        //----  pobieramy wszystkie podroduktu których idzlecenia = req.body.idzlecenia i kasujemy w pętli
          var sql  = "select id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    nrZlecenia ,    rokZlecenia ,    klient ,    praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    przeloty ,    status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    dataCtp from produkty where (Maszyna='H1' or Maszyna='XL' or Maszyna='H3') and ID_zlecenia = '" + idzlecenia+ "' ORDER BY Typ ASC";

        connection.query(sql, function (err, doc) {
        if (err) throw err;

        for (let i = 0; i < Object.keys(doc).length; i++) {
            // console.log(doc[i].typ);
            var sql = "DELETE FROM produkty WHERE ID = '" + doc[i].id + "'";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

            var sql = "update produkty set PoczatekDruku = PoczatekDruku - interval '" + doc[i].czasDruku + "' minute, KoniecDruku = KoniecDruku - interval '" + doc[i].czasDruku + "' minute  where PoczatekDruku > '" + doc[i].poczatekDruku+ "' and Maszyna = '" + doc[i].maszyna+ "'  ";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

            var sql = "DELETE FROM naswietlenia WHERE produkt_id =" +doc[i].id + "";
            connection.query(sql, function (err, result) {
            if (err) throw err;
          
            });

          }
        //console.log(doc);
        });
        //--------koniec kasowania pojedynczych produktów

        var sql = "DELETE FROM zlecenia WHERE ID =" +idzlecenia+ "";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });


            var sql = "update zlecenia set  KolejnoscOprawa=KolejnoscOprawa -1  WHERE KolejnoscOprawa >" +kolejnoscoprawa+ "";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });  
        

    

        var sql = "commit";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Zlecenie skasowane! ");
    res.status(201).json(result);
    });
    }

    //---------utworzenie statusów

    generujStusyProduktow(req,res){
            // kopiuje staare statusy do tabeli produktystatus podając id statusu
        const status = new Map();
        status.set("Nieaktywne", "0");
        status.set("Nowe", "1");
        status.set("Pliki", "2");
        status.set("Akcept", "3");
        status.set("RIP", "4");
        status.set("Zaświecone", "5");
        status.set("Wydrukowane", "6");
        status.set("Sfalcowane", "7");
        status.set("Uszlachetnone", "8");
        status.set("Oprawione", "9");
        status.set("Oddane", "10");
        status.set("Anulowane", "11");

        var sql = "start transaction";
        connection.query(sql, function (err, result) {
        if (err) throw err;  });

        //----  pobieramy wszystkie podroduktu których idzlecenia = req.body.idzlecenia i kasujemy w pętli
        var sql  = "select id,ifnull(ID_Zlecenia,0) as id_zlecenia ,   status  from produkty where (Maszyna='H1' or Maszyna='XL' or Maszyna='H3') and (typ != 'Przerwa' or typ !='Licznik') ";
        connection.query(sql, function (err, doc) {
        if (err) throw err;

        for (let i = 0; i < Object.keys(doc).length; i++) {
            // console.log(doc[i].typ);
            var sql = "INSERT INTO produktystatus  (idproduktu,idzlecenia,idstatusu) values ('" + doc[i].id + "','" + doc[i].id_zlecenia + "','" + status.get(doc[i].status) + "');";
            connection.query(sql, function (err, result) {
            if (err) throw err; });

          }
        //console.log(doc);
        });

        var sql = "commit";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Statusy skopiowane! ");
    res.status(201).json(result);
    });
    }


  //---- generowanie naświetlen - funkcja tymczasowa do zbudowania tabeli naswietlenia

    generujTabeleNaswietlenia_temp(req,res){
        // tymczasowy tworca tabeli naswietlenia - aby przeniesc ilosc blach


    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;  });


    var sql  = "select id,ifnull(xl_ok,0) as xl_ok, ifnull( DATE_FORMAT(`dataCtp`, '%Y-%m-%d %H:%i:%s'),'2081-05-20 08:15:00') AS `datactp` from produkty where Maszyna='XL' and (typ != 'Przerwa' or typ !='Licznik') ";
    connection.query(sql, function (err, doc) {
    if (err) throw err;

    for (let i = 0; i < Object.keys(doc).length; i++) {
        // console.log(doc[i].typ);
        var sql = "INSERT INTO naswietlenia  (produkt_id,ilosc,typ,blacha_id,data) values ('" + doc[i].id + "'," + doc[i].xl_ok + ",'prime',2,'" + doc[i].datactp + "');";
        connection.query(sql, function (err, result) {
        if (err) throw err; });

      }
    //console.log(doc);
    });

    var sql  = "select id,ifnull(sm_ok,0) as sm_ok,ifnull( DATE_FORMAT(`dataCtp`, '%Y-%m-%d %H:%i:%s'),'2081-05-20 08:15:00') AS `datactp`  from produkty where (Maszyna='H1' or Maszyna='H3')  and (typ != 'Przerwa' or typ !='Licznik') ";
    connection.query(sql, function (err, doc) {
    if (err) throw err;

    for (let i = 0; i < Object.keys(doc).length; i++) {
        // console.log(doc[i].typ);
        var sql = "INSERT INTO naswietlenia  (produkt_id,ilosc,typ,blacha_id,data) values ('" + doc[i].id + "'," + doc[i].sm_ok + ",'prime',1,'" + doc[i].datactp + "');";
        connection.query(sql, function (err, result) {
        if (err) throw err; });

      }
    //console.log(doc);
    });




    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Naświetlenia skopiowane! ");
res.status(201).json(result);
});
}
    //---   koniec generowania naswietlen

    //---------generuj zlecenia
    generujStusyZlecen(req,res){
        // kopiuje staare statusy do tabeli zleceniastatus podając id statusu
    const status = new Map();
    status.set("Nieaktywne", "0");
    status.set("Nowe", "1");
    status.set("Pliki", "2");
    status.set("Akcept", "3");
    status.set("RIP", "4");
    status.set("Zaświecone", "5");
    status.set("Wydrukowane", "6");
    status.set("Sfalcowane", "7");
    status.set("Uszlachetnone", "8");
    status.set("Oprawione", "9");
    status.set("Oddane", "10");
    status.set("Anulowane", "11");

    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;  });

  

    //----  pobieramy wszystkie podroduktu których idzlecenia = req.body.idzlecenia i kasujemy w pętli
    var sql  = "select id,status,srodek,okladka  from zlecenia ";
    connection.query(sql, function (err, doc) {
    if (err) throw err;

    for (let i = 0; i < Object.keys(doc).length; i++) {
        // console.log(doc[i].typ);
        var sql = "INSERT INTO zleceniastatus  (idzlecenia,idstatusu,idstatususrodek,idstatusuokladka,idstatusuinne) values ('" + doc[i].id + "','" + status.get(doc[i].status) + "','" + status.get(doc[i].srodek) + "','" + status.get(doc[i].okladka) + "',12);";
        connection.query(sql, function (err, result) {
        if (err) throw err; });

      }
    //console.log(doc);
    });

    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Statusy skopiowane! ");
res.status(201).json(result);
});
}


   loadOprawa(req,res){
    var sql = "SELECT zlecenia.id,zlecenia.utworzono, zlecenia.zmodyfikowano,ifnull(zlecenia.NrZlecenia,'') as nrZlecenia,ifnull(zlecenia.RokZlecenia,'') as rokZlecenia, "+
    "zlecenia.klient,zlecenia.praca,zlecenia.naklad  , "+
    "(select oprawa from produkty where id_zlecenia =zlecenia.id and typ='Środek' limit 1) as oprawa , "+
    "(select sum(OprawaCzas) from produkty where id_zlecenia =zlecenia.id) as oprawaCzas , "+
    "(select max(OprawaPredkosc) from produkty where id_zlecenia =zlecenia.id) as oprawaPredkosc ,  "+
    "(select folia from produkty where id_zlecenia =zlecenia.id and typ='Okładka' limit 1) as folia ,  "+
    "DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,   "+
    "(select sum(przeloty) from produkty where id_zlecenia =zlecenia.id) as przeloty , statusGlowny.nazwa as status , zlecenia.uwagi , "+
    "(select max(FalcPredkosc) from produkty where id_zlecenia =zlecenia.id) as falcPredkosc,  "+
    "(select sum(legi) from produkty where id_zlecenia =zlecenia.id and typ='Środek' limit 1) as legi , "+
    "(select max(legiRodzaj) from produkty where id_zlecenia =zlecenia.id and typ='Środek' limit 1) as legiRodzaj ,  "+
    "(select sum(FalcCzas) from produkty where id_zlecenia =zlecenia.id) as falcCzas  ,  zlecenia.kolejnoscOprawa ,  statusSrodek.nazwa as srodek , statusOkladka.nazwa as okladka,statusInne.nazwa as inne from zlecenia "+
   " left join statusy as statusGlowny on (select min(status) from produkty where id_zlecenia =zlecenia.id)  = statusGlowny.id "+
    "left join statusy as statusSrodek on (select min(status) from produkty where id_zlecenia =zlecenia.id and produkty.Typ='Środek')  = statusSrodek.id "+
    "left join statusy as statusOkladka on (select min(status) from produkty where id_zlecenia =zlecenia.id and produkty.Typ='Okładka')  = statusOkladka.id "+
    "left join statusy as statusInne on (select min(status) from produkty where id_zlecenia =zlecenia.id and (produkty.Typ!='Okładka' and produkty.Typ!='Środek'))  = statusInne.id "+
    // "where spedycja > (now() - interval (select 2-1) month)  ORDER BY KolejnoscOprawa ASC;";
    //"where spedycja > (select max(spedycja) from produkty where status =12) - interval 31 day  ORDER BY KolejnoscOprawa ASC;";
    "ORDER BY KolejnoscOprawa ASC;";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    //sconsole.log(doc);
    res.status(200).json(doc);
});}


    
}

module.exports = new ZleceniaActions();