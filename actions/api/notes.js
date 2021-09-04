const connection = require("../../db/mysql");


module.exports = {
    

        homepage(req,res){
            res.send('Strona główna działa!');
        },

        sel(req,res){
            res.send('sel!');
        },

        saveNote(req,res){
      

            var sql = "INSERT INTO ctp21.m (txt) VALUES ('test6')";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
}


}

