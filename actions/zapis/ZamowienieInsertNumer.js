const connection = require("../mysql");
const zamowienieInsertNumer = (req,res) =>{
  let promises = [];
  let daneZamowienia = req.body[0]
    var sql =   "INSERT INTO artdruk.zamowienia_numer (user_id,zamowienie_id) values ('" + daneZamowienia.user_id + "','" + daneZamowienia.zamowienie_id + "'); ";
   
    console.log(daneZamowienia.zamowienie_id)
    promises.push(     new Promise((resolve, reject) => {
      connection.query(sql, (err, results) => {
      if (err) {
        throw err
          resolve([{zapis: false},err]);               
      } else {
          resolve([{zapis: true},{zamowienie_nr:results.insertId}])
      }
  });
  })) 
  Promise.all(promises).then((data) => res.status(201).json(data));
}

module.exports = {
  zamowienieInsertNumer
    
}
 