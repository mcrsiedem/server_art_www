const connection = require("../db/mysql");


class ZleceniaActions {

    getZlecenia(req,res){
        var sql = "SELECT id,utworzono, zmodyfikowano, kolejnosc,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,klient,praca,naklad , formatPapieru ,  oprawa ,  oprawaCzas , oprawaPredkosc ,  folia ,  DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` , arkusze , legi , legiRodzaj ,  przeloty ,  status , uwagi ,falcPredkosc ,  falcCzas ,  kolejnoscOprawa ,  srodek ,  okladka FROM zlecenia ORDER BY Utworzono ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}

    getZleceniaNieoddane(req,res){
        var sql = "SELECT id,utworzono, zmodyfikowano, kolejnosc,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,klient,praca,naklad , formatPapieru ,  oprawa ,  oprawaCzas , oprawaPredkosc ,  folia ,  DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` , arkusze , legi , legiRodzaj ,  przeloty ,  status , uwagi ,falcPredkosc ,  falcCzas ,  kolejnoscOprawa ,  srodek ,  okladka FROM zlecenia where Status != 'Oddane' ORDER BY Utworzono ASC;";
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
        

    

        var sql = "commit";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Zlecenie skasowane! ");
    res.status(201).json(result);
    });
    }
    //---------Oprawa
    loadOprawa(req,res){
        //const view = req.params['view']
        var sql  = "SELECT id,utworzono, zmodyfikowano, kolejnosc,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,klient,praca,naklad , formatPapieru ,  oprawa ,  oprawaCzas , oprawaPredkosc ,  folia ,  DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` , arkusze , legi , legiRodzaj ,  przeloty ,  status , uwagi ,falcPredkosc ,  falcCzas ,  kolejnoscOprawa ,  srodek ,  okladka FROM zlecenia where OprawaCzas > 0 ORDER BY KolejnoscOprawa ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
                                                });

    }

   // res.status(201).json(req.body);
    
}

module.exports = new ZleceniaActions();