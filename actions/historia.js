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
    

}

module.exports = new HistoriaActions();