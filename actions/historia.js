const connection = require("../db/mysql");


class HistoriaActions {

    postHistoria(req,res){
        
        var sql =   "INSERT INTO historia (User,Kategoria,Event,ID_target,NrZlecenia,RokZlecenia,Klient,Praca,Typ,StatusStary,StatusNowy) "+
                    "values ('" + req.body.user + "','" + req.body.kategoria + "','" + req.body.event + "','" + req.body.ID_target + "','" + req.body.nrzlecenia + "','" + req.body.rokzlecenia + "',"+
                            "'" + req.body.klient + "','" + req.body.praca + "','" + req.body.typ + "','" + req.body.statusstary + "','" + req.body.statusnowy + "'); ";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(" 1 record inserted "+result.insertId);
        res.status(201).json(result);
    });}


   
    getHistoria(req,res){
        var sql = "SELECT id,data, user,kategoria,  event , id_target, ifnull(NrZlecenia,'') as nrZlecenia, ifnull(RokZlecenia,'') as rokZlecenia,"+
        "ifnull(Klient,'') as klient,ifnull(Praca,'') as praca,ifnull(Typ,'') as typ,statusStary,statusNowy FROM historia ORDER BY Data ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}
    

    getRestore(req,res){
        var sql = "SELECT id,DATE_FORMAT(`Utworzono`, '%Y-%m-%d %H:%i:%s') AS `utworzono`, aktualny, opis FROM backup ORDER BY Utworzono ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        console.log(doc);
        res.status(200).json(doc);
    });}
    
    



}

module.exports = new HistoriaActions();