const { DecodeToken } = require("../logowanie/DecodeToken");
const { SendMail } = require("../mail/SendMail");
const { connection, pool } = require("../mysql");

const aktualizujOddaniaUwagi = async (req, res) => {
  let data = req.body; // [text,global_id,zamowienie_id]

   let text = data[0]
   let global_id = data[1]
   let zamowienie_id = data[2]
const token = req.params['token']

let ID_SPRAWCY =  DecodeToken(token).id;



let Update = () =>{ 
    return  new Promise((resolve,reject)=>{
      var sql =   "update artdruk.oddania_grupy set  uwagi=? where global_id =?"
      connection.execute(sql, [text,global_id],function (err, result) {
                if (err) {
                          reject(err);
                        } else resolve("OK"); 
              });
})
}


let Historia = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[ID_SPRAWCY,"Oddania","Uwagi do oddania : "+text,zamowienie_id]
    var sql =   "INSERT INTO artdruk.zamowienia_historia (user_id,kategoria,event,zamowienie_id) values (?,?,?,?); ";
    connection.execute(sql,data, function (err, result) {    
          if (err) {
                          reject(err);
                        } else resolve("OK");
        })
})
}



try {
let res1 = await  Update();  // wstaw wykonanie
let res2 = await  Historia(); // dodaj do historii

res.status(200).json("OK");
    } catch (error) {
      
        SendMail(error)
        console.error("Wystąpił błąd podczas operacji na bazie danych:", error);
        res.status(200).json({ status: error});
    }

      }


module.exports = {
  aktualizujOddaniaUwagi
};
