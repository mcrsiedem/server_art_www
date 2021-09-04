//

module.exports={

    saveNote(req,res){
      

      var sql = "INSERT INTO ctp21.m (txt) VALUES ('test')";
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
}

}