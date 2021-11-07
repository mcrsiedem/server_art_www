const connection = require("../db/mysql");


class ZleceniaActions {

    getZlecenia(req,res){
        var sql = "SELECT id,utworzono, zmodyfikowano, kolejnosc,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,klient,praca,naklad , formatPapieru ,  oprawa ,  oprawaCzas , oprawaPredkosc ,  folia ,  DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` , arkusze , legi , legiRodzaj ,  przeloty ,  status , uwagi ,falcPredkosc ,  falcCzas ,  kolejnoscOprawa ,  srodek ,  okladka FROM zlecenia ORDER BY Utworzono ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}

    getZlecenia2(req,res){
        var sql = "SELECT zlecenia.id,zlecenia.utworzono, zlecenia.zmodyfikowano, zlecenia.kolejnosc,ifnull(zlecenia.NrZlecenia,'') as nrZlecenia,ifnull(zlecenia.RokZlecenia,'') as rokZlecenia,zlecenia.klient,zlecenia.praca,zlecenia.naklad , zlecenia.formatPapieru ,  zlecenia.oprawa ,  zlecenia.oprawaCzas , zlecenia.oprawaPredkosc ,  zlecenia.folia ,  DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` , zlecenia.arkusze , zlecenia.legi , zlecenia.legiRodzaj ,  zlecenia.przeloty , statusGlowny.nazwa as status , zlecenia.uwagi ,zlecenia.falcPredkosc ,  zlecenia.falcCzas ,  zlecenia.kolejnoscOprawa ,  statusSrodek.nazwa as srodek , statusOkladka.nazwa as okladka from zlecenia "+
       " left join status as statusGlowny on (select min(idstatusu) from produktystatus where idzlecenia =zlecenia.id)  = statusGlowny.id "+
        "left join status as statusSrodek on (select min(idstatusu) from produktystatus join produkty on produktystatus.idproduktu = produkty.ID where idzlecenia =zlecenia.id and produkty.Typ='Środek')  = statusSrodek.id "+
        "left join status as statusOkladka on (select min(idstatusu) from produktystatus join produkty on produktystatus.idproduktu = produkty.ID where idzlecenia =zlecenia.id and produkty.Typ='Okładka')  = statusOkladka.id ORDER BY Utworzono ASC;";
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
        var sql =   "SELECT id,utworzono, zmodyfikowano, kolejnosc,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,"+
                    "klient,praca,naklad , formatPapieru ,  oprawa ,  oprawaCzas , oprawaPredkosc ,  folia ,"+
                    "  DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` , arkusze , legi , legiRodzaj ,  przeloty ,  status , uwagi ,falcPredkosc ,"+
                    "  falcCzas ,  kolejnoscOprawa ,  srodek ,  okladka FROM zlecenia where id='"+id+"' ORDER BY Utworzono ASC;";
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
                if (err) throw err;
                });

                var sql = "update produktystatus set idstatusu= '" + value + "' where idproduktu="+id;
                connection.query(sql, function (err, result) {
                if (err) throw err;

                });

                //zmiania status zlecenia na najmniejszy status ze wszystkich produktów
                // var sql = "update zlecenia set Status = ( select min(idstatusu) from produktystatus where idzlecenia = (select idzlecenia from produktystatus where idproduktu = '" + id + "' ))  where id= (select idzlecenia from produktystatus where idproduktu = '" + id + "' ); ";
                // connection.query(sql, function (err, result) {
                // if (err) throw err;
                // });

var sql = "commit";
connection.query(sql, function (err, result) {
if (err) throw err;
console.log("1 record update ");
res.status(201).json(result);
});



}




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

        var sql ="INSERT INTO zlecenia  (ID,Kolejnosc,KolejnoscOprawa,NrZlecenia,RokZlecenia,Klient,Praca,Naklad,Spedycja,Przeloty,OprawaCzas,FalcCzas,Status,Srodek,Okladka,Oprawa,Folia) SELECT MAX(ID)+1,(SELECT MAX(Kolejnosc)+1),(SELECT MAX(KolejnoscOprawa)+1),'" + jsonParsed[0].nr + "','" + jsonParsed[0].rok + "','"+ jsonParsed[0].klient + "','"+ jsonParsed[0].praca + "','"+ jsonParsed[0].naklad + "','"+ jsonParsed[0].spedycja + "','"+ jsonParsed[0].przeloty + "','"+ jsonParsed[0].czasoprawy + "','"+ jsonParsed[0].czasfalcowania + "','Nowe','Nowe','Nowe','"+ jsonParsed[0].oprawa + "','"+ jsonParsed[0].uszlachetnianie + "' FROM zlecenia";
        connection.query(sql, function (err, result) {
        if (err) throw err; });

        var sql = "INSERT INTO historia (User,Kategoria,Event,ID_target,NrZlecenia,RokZlecenia,Klient,Praca,Typ,StatusStary,StatusNowy) values ('" + jsonParsed[0].user + "','Zlecenie','Dodanie zlecenia',(SELECT MAX(ID) from zlecenia),'" + jsonParsed[0].nr + "','" + jsonParsed[0].rok + "','" + jsonParsed[0].klient + "','" + jsonParsed[0].praca + "','Zlecenie','',''); ";
        connection.query(sql, function (err, result) {
        if (err) throw err; });

        for (let i = 0; i < Object.keys(jsonParsed[1]).length; i++) {
      
            var sql = "INSERT INTO produkty  (ID,Kolejnosc,Naklad,Spedycja,ID_Zlecenia,NrZlecenia,RokZlecenia,Klient,Status,Praca,Oprawa,Uwagi,Narzad,Folia,Przeloty,PredkoscDruku,Arkusze,Legi,LegiRodzaj,FalcCzas,FalcPredkosc,OprawaCzas,FormatPapieru,Maszyna,Typ,PoczatekDruku,CzasDruku,KoniecDruku) SELECT MAX(ID)+1,(SELECT MAX(Kolejnosc)+1),'" +jsonParsed[0].naklad+ "','" +jsonParsed[0].spedycja+ "', (select MAX(ID) from zlecenia) as ID_Zlecenia ,'"+ jsonParsed[0].nr + "','"+ jsonParsed[0].rok + "','"+ jsonParsed[0].klient + "','Nowe','"+ jsonParsed[1][i].praca + "','"+ jsonParsed[1][i].oprawa+ "','"+ jsonParsed[1][i].uwagi+ "','"+ jsonParsed[1][i].narzad+ "','"+ jsonParsed[1][i].folia+ "','"+ jsonParsed[1][i].przeloty+ "','"+ jsonParsed[1][i].predkoscDruku+ "','"+ jsonParsed[1][i].arkusze+ "','"+ jsonParsed[1][i].legi+ "','"+ jsonParsed[1][i].legiRodzaj+ "','"+ jsonParsed[1][i].falcCzas+ "','"+ jsonParsed[1][i].falcPredkosc+ "','"+ jsonParsed[1][i].oprawaCzas+ "','"+ jsonParsed[1][i].formatPapieru+ "','"+ jsonParsed[1][i].maszyna + "','"+ jsonParsed[1][i].typ + "', (select MAX(KoniecDruku) from produkty where maszyna='"+ jsonParsed[1][i].maszyna + "') as PoczatekDruku ,'"+ jsonParsed[1][i].czasDruku+ "',(select MAX(KoniecDruku) from produkty where maszyna='"+ jsonParsed[1][i].maszyna + "') + interval '"+ jsonParsed[1][i].czasDruku+ "' minute as KoniecDruku  FROM produkty";
            connection.query(sql, function (err, result) {
            if (err) throw err; });

            // dodawanie statusu na nowych sposób do łączonej tabeli produktystatus
         //   var sql = "INSERT INTO produktystatus  (idproduktu,idzlecenia,idstatusu) values (select MAX(ID) from produkty as idproduktu ,(select MAX(ID) from zlecenia) as idzlecenia,2);";
           var sql = "INSERT INTO produktystatus  (idproduktu,idzlecenia,idstatusu) values ((select MAX(ID) from produkty as idproduktu),(select MAX(ID) from zlecenia as idzlecenia),1);";
            connection.query(sql, function (err, result) {
            if (err) throw err; });

          }
          var sql = "INSERT INTO zleceniastatus  (idzlecenia,idstatusu,idstatususrodek,idstatusuokladka,idstatusuinne) values ((select MAX(ID) from zlecenia as idzlecenia),1,1,1,1);";
          connection.query(sql, function (err, result) {
          if (err) throw err; });
         

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
          }
        //console.log(doc);
        });
        //--------koniec kasowania pojedynczych produktów

        var sql = "DELETE FROM zlecenia WHERE ID =" +idzlecenia+ "";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

            var sql = "update zlecenia set  Kolejnosc=Kolejnosc -1  WHERE Kolejnosc >" +kolejnosc+ "";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });   

            var sql = "update zlecenia set  KolejnoscOprawa=KolejnoscOprawa -1  WHERE KolejnoscOprawa >" +kolejnoscoprawa+ "";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });  
        
            var sql = "DELETE FROM produktystatus WHERE idzlecenia =" +idzlecenia+ "";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

            var sql = "DELETE FROM zleceniastatus WHERE idzlecenia =" +idzlecenia+ "";
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

    //---------Oprawa
    loadOprawa(req,res){
        //const view = req.params['view']
        var sql  = "SELECT id,utworzono, zmodyfikowano, kolejnosc,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,klient,praca,naklad , formatPapieru ,  oprawa ,  oprawaCzas , oprawaPredkosc ,  folia ,  DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` , arkusze , legi , legiRodzaj ,  przeloty ,  status , uwagi ,falcPredkosc ,  falcCzas ,  kolejnoscOprawa ,  srodek ,  okladka FROM zlecenia ORDER BY KolejnoscOprawa ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
                                                });

    }

   // res.status(201).json(req.body);
    
}

module.exports = new ZleceniaActions();