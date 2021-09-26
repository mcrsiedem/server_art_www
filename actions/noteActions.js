const connection = require("../db/mysql");


class NoteActions {

        // homepage(req,res){
        //     res.send('Strona główna działa!');
        // }

        getZlecenia(req,res){
            var sql = "SELECT id,utworzono, zmodyfikowano, kolejnosc,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,klient,praca,naklad , formatPapieru ,  oprawa ,  oprawaCzas , oprawaPredkosc ,  folia ,  DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` , arkusze , legi , legiRodzaj ,  przeloty ,  status , uwagi ,falcPredkosc ,  falcCzas ,  kolejnoscOprawa ,  srodek ,  okladka FROM ctp21.zlecenia ORDER BY Utworzono ASC;";
            connection.query(sql, function (err, doc) {
            if (err) throw err;
            //sconsole.log(doc);
            res.status(200).json(doc);
        });}

        getProduktyByMaszyna(req,res){
            const maszyna = req.params['maszyna']
            var sql = "select DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku`,czasDruku,DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku`,ifnull(Klient,'') as klient,ifnull(Praca,'') as praca,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,typ,formatPapieru,DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,naklad,przeloty,arkusze,predkoscDruku,status,id,id_zlecenia,maszyna,narzad,folia,kolejnosc,uwagi from ctp21.produkty where maszyna='" + maszyna + "' ORDER BY PoczatekDruku";
            connection.query(sql, function (err, doc) {
            if (err) throw err;
            console.log(maszyna);
            res.status(200).json(doc);
        });}


        getCTP(req,res){
            var sql = "SELECT id,utworzono, kolejnosc,praca,  status , uwagi FROM ctp21.ctp ORDER BY Utworzono ASC;";
            connection.query(sql, function (err, doc) {
            if (err) throw err;
            //sconsole.log(doc);
            res.status(200).json(doc);
        });}


        //--------------------


        getAllNotes(req,res){
            var sql = "SELECT * FROM ctp21.m";
            connection.query(sql, function (err, doc) {
            if (err) throw err;
            //sconsole.log(doc);
            res.status(200).json(doc);
        });}

        getNote(req,res){
            const id = req.params.id;
            var sql = "SELECT * FROM ctp21.m where id="+id;
            connection.query(sql, function (err, doc) {
            if (err) throw err;
            //sconsole.log(doc);
            res.status(200).json(doc);
        });}

        saveNote(req,res){
            const title = req.body.title;
            const body = req.body.body;
            var sql = "INSERT INTO ctp21.m (title,body) VALUES ('"+title+"','"+body+"')";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            ;
            console.log(" 1 record inserted "+result.insertId);
            res.status(201).json(result);
        });}

        


        updateNote(req,res){
            const id = req.body.id;
            const title = req.body.title;
            const body = req.body.body;
            var sql = "update ctp21.m set title='"+title+"', body ='"+body+"' where id="+id;
            connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record update ");
            res.status(201).json(result);
        });}

        deleteNote(req,res){
            const id = req.body.id;
            var sql = "DELETE FROM  ctp21.m where id="+id;
            connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record delete ");
            res.status(204).json(result);
        });}
}

module.exports = new NoteActions();
