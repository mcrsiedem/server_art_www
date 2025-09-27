const { DecodeToken } = require("../logowanie/DecodeToken");
const connection = require("../mysql");

const dodajInfoDostepnoscPapieru = async (req, res) => {
  // let row = req.body; 
  let data = req.body; // [text,global_id,zamowienie_id]
 let papier_info = data.papier_info
 let zamowienie_id = data.zamowienie_id
 let technologia_id = data.technologia_id
 let element_id = data.element_id
  //  let text = data[0]
  //  let global_id = data[1]
  //  let zamowienie_id = data[2]
const token = req.params['token']

let ID_SPRAWCY =  DecodeToken(token).id;




let Update = () =>{ 
    return  new Promise((resolve,reject)=>{
      var sql =   "update artdruk.technologie_elementy set  papier_info=? where technologia_id =? and id=? and global_id>0 "
      connection.execute(sql, [papier_info,technologia_id,element_id],function (err, result) {
                if (err) reject(err); 
           resolve("OK") 
              });
})
}


let Historia = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[ID_SPRAWCY,"Papier info ",papier_info,zamowienie_id]
    var sql =   "INSERT INTO artdruk.zamowienia_historia (user_id,kategoria,event,zamowienie_id) values (?,?,?,?); ";
    connection.execute(sql,data, function (err, result) {    
          if (err) reject(err); 
           resolve("OK")
        })
})
}



try {
let res1 = await  Update();  // wstaw wykonanie
let res2 = await  Historia(); // dodaj do historii


// pobierz tylko nowy status i odeślij go aby zaaktualizować
res.status(200).json({ status: "OK"});
    } catch (error) {
        // Ten blok przechwyci błąd `err` przekazany przez `reject(err)`
        // z dowolnej z funkcji (Insert, Historia).
        console.error("Wystąpił błąd podczas operacji na bazie danych:", error);
        res.status(200).json({ status: error});
    }

      }


module.exports = {
  dodajInfoDostepnoscPapieru
};
