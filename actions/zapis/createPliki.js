const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");


const cratePliki = (req,res) =>{

// funkcja do skasowania
// napisana aby utworzyć pliki z elementow - uzyta raz 

  let promises = [];


  var sql  = "select * from artdruk.zamowienia_elementy"
  // var sql  = "select * from artdruk.view_zamowienia_produkty_koszty ORDER BY id ASC";
  connection.query(sql, function (err, elementy) {
  // if (err) throw err;
  // res.status(200).json(doc);
console.log(elementy)
for (let element of elementy) {
  var sql =
    "INSERT INTO artdruk.zamowienia_pliki (id,zamowienie_id,produkt_id,element_id,uwagi,stan,status,etap,indeks) " +
    "values ('" +
    element.id +  "','" +
    element.zamowienie_id +        "','" +
    element.produkt_id +        "','" +
    element.id +        "','" +
    element.uwagi +        "'," +
    element.stan +        "," +
    element.status +        ",1,'" +
    element.indeks +        "'); ";

  promises.push(     new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
    if (err) {
      throw err
        resolve([{zapis: false},err]);               
    } else {
        resolve([{zapis: true}])
    }
});
})) 

}

});





  Promise.all(promises).then((data) => res.status(201).json(data));

}

module.exports = {
  cratePliki
    
}
 