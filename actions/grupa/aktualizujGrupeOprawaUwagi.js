const connection = require("../mysql");

const aktualizujGrupeOprawaUwagi = (req, res) => {
  let data = req.body; // [text,global_id]

  //  let text = data[0]
  //  let global_id = data[1]


      var sql =   "update artdruk.technologie_grupy_wykonan_oprawa set  uwagi=? where global_id =?"
      connection.execute(sql, data,function (err, result) {
                if (err) throw err; 
              res.json("OK")  
              });
      }


module.exports = {
  aktualizujGrupeOprawaUwagi
};
