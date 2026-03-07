const { pool } = require("../mysql"); // używamy tylko pool

const postVersion = (req, res) => {
  let promises = [];
  let body = req.body;

  let newHashFileName = body.newHashFileName;
  let kto = body.kto;

  var sql = "INSERT INTO artdruk.version (ver) values (?); ";
  let dane = [newHashFileName];

  promises.push(
    new Promise((resolve, reject) => {
      // Zmieniamy connection na pool, ale zostawiamy callback
      pool.execute(sql, dane, (err, results) => {
        if (err) {
          resolve([{ zapis: false }, err]);
        } else {
          resolve([{ zapis: true }, { zamowienie_nr: results.insertId }]);
        }
      });
    })
  );

  Promise.all(promises).then((data) => {
    res.status(201).json(data);
  });
};

module.exports = {
  postVersion,
};