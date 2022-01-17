const connection = require("../db/mysql");

class DrukActions {

    getProduktyByMaszyna(req,res){
        const maszyna = req.params['maszyna']
        const iloscdniwstecz = req.params['iloscdniwstecz']

        var sql = "select DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku`,czasDruku,DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku`,ifnull(Klient,'') as klient,ifnull(Praca,'') as praca,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,produkty.typ,formatPapieru,DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,naklad,przeloty,arkusze,predkoscDruku,statusy.nazwa as status,produkty.id,id_zlecenia,maszyna,narzad,folia,kolejnosc,uwagi,produkty.nazwa,naswietlenia.ilosc as sm_ok,sm_dmg ,naswietlenia.ilosc as xl_ok ,xl_dmg,oprawa from produkty left join naswietlenia on  produkty.id = naswietlenia.produkt_id left join statusy on produkty.status = statusy.id    where (naswietlenia.typ = 'prime') and ( maszyna='" + maszyna + "') and (KoniecDruku > (SELECT max(KoniecDruku) - interval '" + iloscdniwstecz + "' day FROM ctp21.produkty where Maszyna='" + maszyna + "' and Status=7)) ORDER BY PoczatekDruku";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        console.log(maszyna);
        res.status(200).json(doc);
    });}

    getNaswietlenia(req,res){
        var sql = "SELECT produkty.id,produkty.typ,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,klient,praca, status,DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku`,DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku`, "+
        "spedycja, maszyna,arkusze, naswietlenia.id as naswietlenia_id,blacha.typ as blacha_id, grupa_id,stan,ilosc,opis.nazwa as opis,DATE_FORMAT(`data`, '%Y-%m-%d %H:%i') AS `data`,kolej,naswietlenia.typ as naswietlenia_typ FROM produkty right join naswietlenia on produkty.id = naswietlenia.produkt_id left join blacha on naswietlenia.blacha_id = blacha.id left join opis on naswietlenia.opis = opis.id where (produkty.typ !='Przerwa')  ORDER BY data ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}

    getOpisNaswietlen(req,res){
        var sql = "SELECT id,nazwa from opis  ORDER BY id ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}

    getProduktyByMaszyna_stare(req,res){
        // kopia zapasowa wczytywania ilosci blach w druku z tabeli produkty z kolumn sm_ok i xl_ok
        const maszyna = req.params['maszyna']
        const iloscdniwstecz = req.params['iloscdniwstecz']

        var sql = "select DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku`,czasDruku,DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku`,ifnull(Klient,'') as klient,ifnull(Praca,'') as praca,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,typ,formatPapieru,DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,naklad,przeloty,arkusze,predkoscDruku,statusy.nazwa as status,produkty.id,id_zlecenia,maszyna,narzad,folia,kolejnosc,uwagi,produkty.nazwa,sm_ok,sm_dmg ,xl_ok ,xl_dmg,oprawa from produkty left join statusy on produkty.status = statusy.id where maszyna='" + maszyna + "' and (KoniecDruku > (SELECT max(KoniecDruku) - interval '" + iloscdniwstecz + "' day FROM ctp21.produkty where Maszyna='" + maszyna + "' and Status=7)) ORDER BY PoczatekDruku";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        console.log(maszyna);
        res.status(200).json(doc);
    });}



    dragDropDruk(req,res){

        const kierunek = req.body.kierunek;
        const drag_id = req.body.drag_id;
        const drag_poczatekDruku= req.body.drag_poczatekDruku;
        const drag_czasDruku= req.body.drag_czasDruku;
        const drop_maszyna= req.body.drop_maszyna;
        const drop_poczatekDruku= req.body.drop_poczatekDruku;
        const drop_koniecDruku= req.body.drop_koniecDruku;

        if(kierunek == "z gory na dol"){

                var sql = "start transaction";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });

                var sql = "update produkty set PoczatekDruku = PoczatekDruku - interval " + drag_czasDruku + " minute, KoniecDruku = KoniecDruku - interval " + drag_czasDruku + " minute  where  PoczatekDruku > '" + drag_poczatekDruku+ "' and Maszyna = '" + drop_maszyna+"'";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });

                var sql = "update produkty set PoczatekDruku = PoczatekDruku + interval " + drag_czasDruku + " minute, KoniecDruku = KoniecDruku + interval " + drag_czasDruku + " minute  where  PoczatekDruku >= '" + drop_koniecDruku+ "' - interval " + drag_czasDruku + " minute and Maszyna = '" + drop_maszyna+"'";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });

                var sql = "update produkty set PoczatekDruku = '" + drop_koniecDruku+ "' - interval " + drag_czasDruku + " minute , KoniecDruku = '" + drop_koniecDruku + "' where ID = '" + drag_id+"'";
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

        if(kierunek == "z dolu na gore"){

        var sql = "start transaction";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

            var sql = "update produkty set PoczatekDruku = PoczatekDruku - interval " + drag_czasDruku + " minute, KoniecDruku = KoniecDruku - interval " + drag_czasDruku + " minute  where  PoczatekDruku > '" + drag_poczatekDruku+ "' and Maszyna = '" + drop_maszyna+"'";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

            var sql = "update produkty set PoczatekDruku = PoczatekDruku + interval " + drag_czasDruku + " minute, KoniecDruku = KoniecDruku + interval " + drag_czasDruku + " minute  where  PoczatekDruku >= '" + drop_poczatekDruku+ "' and Maszyna = '" + drop_maszyna+"'";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

            var sql = "update produkty set PoczatekDruku = '" + drop_poczatekDruku+ "' , KoniecDruku = '" + drop_poczatekDruku + "' + interval " + drag_czasDruku + " minute where ID = '" + drag_id+"'";
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
}


updateCzasDruk(req,res){

    const id = req.body.id;
    const czas = req.body.czas;
    const koniecDruku= req.body.koniecDruku;
    const maszyna= req.body.maszyna;
    const zmiana= req.body.zmiana;
    const typ= req.body.typ;
    const SumaNowegoCzasu= req.body.SumaNowegoCzasu;

    var sql = "start transaction";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

    if(typ == "Przerwa"){

        if(zmiana == "dodaj"){

           var sql = "update produkty set CzasDruku = CzasDruku + '" + czas + "', KoniecDruku = KoniecDruku + interval '" + czas + "' minute  where id='" + id + "'";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

            var sql = "update produkty set PoczatekDruku = PoczatekDruku + interval '" + czas + "' minute, KoniecDruku = KoniecDruku + interval '" + czas + "' minute  where PoczatekDruku >= '" + koniecDruku+ "' and Maszyna = '" + maszyna+ "'  ";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

        }

        if(zmiana == "odejmij"){
            var sql = "update produkty set CzasDruku = CzasDruku - '" + czas + "', KoniecDruku = KoniecDruku - interval '" + czas + "' minute  where id='" + id + "'";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

            var sql = "update produkty set PoczatekDruku = PoczatekDruku - interval '" + czas + "' minute, KoniecDruku = KoniecDruku - interval '" + czas + "' minute  where PoczatekDruku >= '" + koniecDruku+ "' - interval '" + SumaNowegoCzasu + "' minute and Maszyna = '" + maszyna+ "'  ";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

         }}


         if(typ != "Przerwa"){

            if(zmiana == "dodaj"){
    
               var sql = "update produkty set CzasDruku = CzasDruku + '" + czas + "', KoniecDruku = KoniecDruku + interval '" + czas + "' minute, PredkoscDruku = Przeloty/(  '" + SumaNowegoCzasu + "' - (Arkusze * Narzad) )*60  where id='" + id + "'";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });
    
                var sql = "update produkty set PoczatekDruku = PoczatekDruku + interval '" + czas + "' minute, KoniecDruku = KoniecDruku + interval '" + czas + "' minute  where PoczatekDruku >= '" + koniecDruku+ "' and Maszyna = '" + maszyna+ "'  ";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });
    
            }
    
            if(zmiana == "odejmij"){
                var sql = "update produkty set CzasDruku = CzasDruku - '" + czas + "', KoniecDruku = KoniecDruku - interval '" + czas + "' minute, PredkoscDruku = Przeloty/(  '" + SumaNowegoCzasu + "' - (Arkusze * Narzad) )*60   where id='" + id + "'";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });
                
                console.log("koniecDruku1 ",koniecDruku);
                var sql = "update produkty set PoczatekDruku = PoczatekDruku - interval '" + czas + "' minute, KoniecDruku = KoniecDruku - interval '" + czas + "' minute  where PoczatekDruku >= '" + koniecDruku+ "' - interval '" + SumaNowegoCzasu + "' minute and Maszyna = '" + maszyna+ "'  ";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("koniecDruku2 ",koniecDruku);
                });
    
             }



            
    }

   

    var sql = "commit";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record update ");
        res.status(201).json(result);
        });
}

insertPrzerwaDruk(req,res){

    const maszyna = req.body.maszyna;
    const koniecDruku = req.body.koniecDruku;

    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });

    var sql = "update produkty set PoczatekDruku = PoczatekDruku + interval 60 minute, KoniecDruku = KoniecDruku + interval 60 minute  where  PoczatekDruku >= '" + koniecDruku+ "' and Maszyna = '" + maszyna+ "'  ";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });

    var sql = "INSERT INTO produkty  (ID,Kolejnosc,Maszyna,Typ,PoczatekDruku,CzasDruku,KoniecDruku)  SELECT MAX(ID)+1,(SELECT MAX(Kolejnosc)+1),'" + maszyna + "','Przerwa','" + koniecDruku + "','60','" + koniecDruku + "' + interval 60 minute from produkty";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(" 1 record inserted "+result.insertId);

    });

    var sql = "INSERT INTO naswietlenia  (produkt_id,kolej,typ) select (SELECT MAX(id) from produkty) as id, (select MAX(kolej)+1 from naswietlenia) as kolej,'prime' ;";
            connection.query(sql, function (err, result) {
            if (err) throw err; });

    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update ");
    res.status(201).json(result);
    });
}

deleteProduktSelectOne(req,res){
    const id = req.body.id;
    const kolejnosc = req.body.kolejnosc;
    const maszyna = req.body.maszyna;
    const poczatekdruku = req.body.poczatekdruku;
    const czasdruku = req.body.czasdruku;

    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });

    var sql = "DELETE FROM produkty WHERE ID =" +id+ "";
    connection.query(sql, function (err, result) {
    if (err) throw err;

    });

    var sql = "update produkty set PoczatekDruku = PoczatekDruku - interval '" + czasdruku + "' minute, KoniecDruku = KoniecDruku - interval '" + czasdruku + "' minute  where PoczatekDruku > '" + poczatekdruku+ "' and Maszyna = '" + maszyna+ "'  ";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });

    var sql = "DELETE FROM naswietlenia WHERE produkt_id =" +id+ "";
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

duplikujDruk(req,res){
    const id = req.body.id;
    const maszyna = req.body.maszyna;
    const koniecdruku = req.body.koniecdruku;
    const czasdruku = req.body.czasdruku;

    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });

    var sql = "update produkty set PoczatekDruku = PoczatekDruku + interval '"+czasdruku+"' minute, KoniecDruku = KoniecDruku + interval '"+czasdruku+"' minute  where  PoczatekDruku >= '" + koniecdruku+ "' and Maszyna = '" + maszyna+ "'  ";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });

    var sql = "insert into produkty (ID,ID_zlecenia,Kolejnosc,Klient,Praca,PoczatekDruku,CzasDruku,KoniecDruku,Maszyna,Typ,PredkoscDruku,Narzad,NrZlecenia,RokZlecenia,Naklad,FormatPapieru,Oprawa,OprawaCzas,OprawaPredkosc,Folia,Spedycja,Arkusze,Legi,LegiRodzaj,Przeloty,Status,Uwagi,SM_ok,SM_dmg,XL_ok,XL_dmg,FalcPredkosc,FalcCzas)\n" +
    "\n" +
    "select (select MAX(ID)+1 from produkty),ID_zlecenia, (select MAX(Kolejnosc)+1 from produkty),Klient,Praca,\n" +
    "'"+koniecdruku+"',\n" +
    "CzasDruku,\n" +
    "'"+koniecdruku+"' + interval CzasDruku Minute,\n" +
    "Maszyna,Typ,PredkoscDruku,Narzad,NrZlecenia,RokZlecenia,Naklad,FormatPapieru,Oprawa,OprawaCzas,OprawaPredkosc,Folia,Spedycja,Arkusze,Legi,LegiRodzaj,Przeloty,Status,Uwagi,SM_ok,SM_dmg,XL_ok,XL_dmg,FalcPredkosc,FalcCzas \n" +
    "from produkty\n" +
    " where id ='"+id+"'";

    connection.query(sql, function (err, result) {
        if (err) throw err;
        });

    var sql = "INSERT INTO naswietlenia  (produkt_id,kolej,typ) select (SELECT MAX(id) from produkty) as id, (select MAX(kolej)+1 from naswietlenia) as kolej,'prime' ;";
            connection.query(sql, function (err, result) {
            if (err) throw err; });

    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update ");
    res.status(201).json(result);

});
}

//--- duplikuj naświetlenie

duplikujNaswietlenie(req,res){
    const id = req.body.id;


    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });

    var sql = "insert into naswietlenia (produkt_id,blacha_id,kolej,grupa_id,data)  (select produkt_id,blacha_id,(select max(kolej)+1 from naswietlenia),(select max(id) from grupa), now() from naswietlenia where id= '"+id+"');";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        });


    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Naswietlenie zduplikowane");
    res.status(201).json(result);


});
}

//---


//----

updateZamknijGrupe(req,res){
    const id = req.body.id;

    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });

   
    var sql = "update grupa set stan = 'Closed', koniec= now() where id=( select max(id))";
    connection.query(sql, function (err, result) {
    if (err) throw err;     });

    var sql = "update naswietlenia set stan = 'Closed' where grupa_id= (select max(id) from grupa)";
    connection.query(sql, function (err, result) {
    if (err) throw err;     })

    var sql = "INSERT INTO grupa  (id,poczatek,stan)  SELECT MAX(id)+1,now(),'Open' from grupa";
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
//---


zmienMaszyne(req,res){
    const id = req.body.id;
    const czasdruku = req.body.czasdruku;
    const koniecdruku = req.body.koniecdruku;
    const staraMaszyna = req.body.staraMaszyna;
    const nowaMaszyna = req.body.nowaMaszyna;

    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });

    var sql = "update produkty set PoczatekDruku = PoczatekDruku - interval '"+czasdruku+"' minute, KoniecDruku = KoniecDruku - interval '"+czasdruku+"' minute  where  PoczatekDruku >= '" + koniecdruku+ "' and Maszyna = '" + staraMaszyna+ "'  ";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });

    if((nowaMaszyna == "H1" || nowaMaszyna == "H3") && (staraMaszyna == "H1" ||staraMaszyna == "H3") ){

        console.log("z SM na SM");
        var sql =   "update produkty SET \n"+
        "PoczatekDruku = (SELECT * FROM (SELECT MAX(KoniecDruku) FROM produkty WHERE  maszyna='" + nowaMaszyna + "') AS PoczatekDruku), \n" +
        "Maszyna = '" + nowaMaszyna + "',\n" +
        "KoniecDruku = ( SELECT * FROM (SELECT MAX(KoniecDruku) FROM produkty WHERE  maszyna='" + nowaMaszyna + "') AS PoczatekDruku) + interval '" + czasdruku + "' minute where id='" + id + "'";

        connection.query(sql, function (err, result) {
        if (err) throw err;
        });

    }


    if((staraMaszyna == "H1" || staraMaszyna == "H3") && (nowaMaszyna == "XL") ){

        console.log("z SM na SM");
        var sql =   "update produkty SET \n"+
        "PoczatekDruku = (SELECT * FROM (SELECT MAX(KoniecDruku) FROM produkty WHERE  maszyna='" + nowaMaszyna + "') AS PoczatekDruku), \n" +
        "Maszyna = '" + nowaMaszyna + "',\n" +
        "Narzad = Narzad /2 ,\n" +
        "CzasDruku = '" + czasdruku + "' /2,    \n" +
        "PredkoscDruku = PredkoscDruku *2,\n" +
        "KoniecDruku = ( SELECT * FROM (SELECT MAX(KoniecDruku) FROM produkty WHERE  maszyna='" + nowaMaszyna + "') AS PoczatekDruku) + interval ('" + czasdruku + "' /2 ) minute where id='" + id + "'";

        connection.query(sql, function (err, result) {
        if (err) throw err;
        });

    }

    
    if((staraMaszyna == "XL") && (nowaMaszyna == "H1" || nowaMaszyna == "H3") ){

        console.log("z SM na SM");
        var sql =   "update produkty SET \n"+
        "PoczatekDruku = (SELECT * FROM (SELECT MAX(KoniecDruku) FROM produkty WHERE  maszyna='" + nowaMaszyna + "') AS PoczatekDruku), \n" +
        "Maszyna = '" + nowaMaszyna + "',\n" +
        "Narzad = Narzad *2 ,\n" +
        "CzasDruku = '" + czasdruku + "' *2,    \n" +
        "PredkoscDruku = PredkoscDruku /2,\n" +
        "KoniecDruku = ( SELECT * FROM (SELECT MAX(KoniecDruku) FROM produkty WHERE  maszyna='" + nowaMaszyna + "') AS PoczatekDruku) + interval ('" + czasdruku + "' *2 ) minute where id='" + id + "'";

        connection.query(sql, function (err, result) {
        if (err) throw err;
        });

    }





    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update ");
    res.status(201).json(result);


});}

}

module.exports = new DrukActions();