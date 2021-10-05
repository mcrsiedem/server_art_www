const connection = require("../db/mysql");
const baza="ctp21";

class NoteActions {

    
        getAllNotes(req,res){
            var sql = "SELECT * FROM "+baza+".m";
            connection.query(sql, function (err, doc) {
            if (err) throw err;
            //sconsole.log(doc);
            res.status(200).json(doc);
        });}

        getNote(req,res){
            const id = req.params.id;
            var sql = "SELECT * FROM "+baza+".m where id="+id;
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
