const connection = require("../db/mysql");


class UsersActions {

    
    getUser(req,res){

        const login = req.params['login']
        const haslo = req.params['haslo']
        var sql = "select id,imie,nazwisko,login,haslo,dostep from users where login ='" + login + "' and haslo = '" + haslo + "';";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}
}

module.exports = new UsersActions();