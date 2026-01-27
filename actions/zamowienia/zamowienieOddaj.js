const { DecodeToken } = require("../logowanie/DecodeToken");
const { SendMail } = require("../mail/SendMail");
const { connection, pool } = require("../mysql");

const zamowienieOddaj = async (req, res) => {

  // specjalny guzik w zamówieniu do sztucznego ODDANIA pracy dostępny tylko dla mnie w celu porządkowania


  let data = req.body; // [text,global_id,zamowienie_id]


const token = req.params['token']

let ID_SPRAWCY =  DecodeToken(token).id;

let etap = data.etap
let id = data.id


let Update =  () =>{ 
    return  new Promise((resolve,reject)=>{
      var sql =   "update artdruk.zamowienia set etap=16 where id =?"
      connection.execute(sql, [id],function (err, result) {
                if (err) {
                  console.log(err)
                          reject(err);
                        } else resolve("OK"); 
              });
})
}





try {
  // console.log("Próbuję wykonać Update...");
let res1 = await  Update();  // wstaw wykonanie

// console.log(id)

res.status(200).json({ status: "ok"});
    } catch (error) {
      
        SendMail(error)
        console.error("Wystąpił błąd podczas operacji na bazie danych:", error);
        res.status(200).json({ status: error});
    }

      }


module.exports = {
  zamowienieOddaj
};
