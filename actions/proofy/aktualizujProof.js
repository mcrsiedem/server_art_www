const { DecodeToken } = require("../logowanie/DecodeToken");
const { SendMail } = require("../mail/SendMail");
const { connection, pool } = require("../mysql");

const aktualizujProof = async (req, res) => {
  let data = req.body; // [text,global_id,zamowienie_id]

   let text = data[0]
   let global_id = data[1]
   let zamowienie_id = data[2]
const token = req.params['token']

let ID_SPRAWCY =  DecodeToken(token).id;

let firma_id = data.firma_id || null;
let klient_id = data.klient_id || null;
let data_zamowienia = data.data_zamowienia || null;
let uwagi = data.uwagi || null;
let status = data.status || null;
let format = data.format || null;
let ilosc = data.ilosc|| null;
let id = data.id || null;
let faktura = data.faktura || null;


let Update =  () =>{ 
    return  new Promise((resolve,reject)=>{
      var sql =   "update artdruk.zamowienia_proofy set firma_id=?,klient_id=?, data_zamowienia=?, uwagi=?, status=?, format=?, ilosc=?,faktura=? where id =?"
      connection.execute(sql, [firma_id,klient_id,data_zamowienia,uwagi,status,format,ilosc,faktura,id],function (err, result) {
                if (err) {
                  console.log(err)
                          reject(err);
                        } else resolve("OK"); 
              });
})
}


let Historia = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[ID_SPRAWCY, `Klient: ${klient_id} Data: ${data_zamowienia} Format: ${format} Ilość: ${ilosc} Uwagi: ${uwagi} Faktura: ${faktura}` ,id]
    var sql =   "INSERT INTO artdruk.zamowienia_proof_historia (user_id,uwagi,proof_id) values (?,?,?); ";
    connection.execute(sql,data, function (err, result) {    
          if (err) {
                          reject(err);
                        } else resolve("OK");
        })
})
}



try {
  // console.log("Próbuję wykonać Update...");
let res1 = await  Update();  // wstaw wykonanie
// console.log("Wynik Update:", res1); // Teraz powinno się wyświetlić
let res2 = await  Historia(); // dodaj do historii
console.log(res1)

res.status(200).json({ status: "ok"});
    } catch (error) {
      
        // SendMail(error)
        console.error("Wystąpił błąd podczas operacji na bazie danych:", error);
        res.status(200).json({ status: error});
    }

      }


module.exports = {
  aktualizujProof
};
