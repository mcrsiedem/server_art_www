const { DecodeToken } = require("../logowanie/DecodeToken");
const connection = require("../mysql");

const dodajRealizacjeOprawy = async (req, res) => {
let row = req.body;
let id;
const token = req.params['token']
let ID_SPRAWCY =  DecodeToken(token).id;

const zamowienie_id = req.body.zamowienie_id;


let Insert = () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[row.id,row.technologia_id,row.zamowienie_id,row.id,row.oprawa_id,row.naklad,row.proces_id,row.procesor_id]
      var sql =   "INSERT INTO artdruk.technologie_wykonania_oprawa (id,technologia_id,zamowienie_id, grupa_id,oprawa_id,naklad,proces_id,procesor_id) values (?,?,?,?,?,?,?,?); ";
      connection.execute(sql, data,function (err, result) {     
          //  if (err) throw err; 
            if (err) reject(err); 

            id = result.insertId
           resolve("OK")
        })
})
}


let Historia = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[ID_SPRAWCY,"Oprawa","Oprawiono: "+row.naklad+" szt.",zamowienie_id]
    var sql =   "INSERT INTO artdruk.zamowienia_historia (user_id,kategoria,event,zamowienie_id) values (?,?,?,?); ";
    connection.execute(sql,data, function (err, result) {    
          //  if (err) throw err; 
            if (err) reject(err); 

           resolve("OK")
        })


})
}


try {
let res1 = await  Insert();
let res2 = await  Historia();
//CALL aktualizacja_statusu_oprawy_vs_realizacja(12345, 6789);
// pobierz tylko nowy status i odeślij go aby zaaktualizować
res.status(200).json({status:"OK",insertId : id });
    } catch (error) {
        // Ten blok przechwyci błąd `err` przekazany przez `reject(err)`
        // z dowolnej z funkcji (Insert, Historia).
        console.error("Wystąpił błąd podczas operacji na bazie danych:", error);
        res.status(200).json({ status: error});
    }



     }


module.exports = {
  dodajRealizacjeOprawy
};


// let res1 = await save().catch(error => {
//         console.error("Błąd w save():", error);
//         res.status(500).json({ error: "Błąd podczas zapisywania." });
//     });