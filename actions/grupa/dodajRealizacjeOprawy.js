const { DecodeToken } = require("../logowanie/DecodeToken");
const connection = require("../mysql");

const dodajRealizacjeOprawy = async (req, res) => {
let row = req.body;
let id;
const token = req.params['token']
let ID_SPRAWCY =  DecodeToken(token).id;

const zamowienie_id = req.body.zamowienie_id;
const grupa_id = req.body.id;
const global_id = req.body.global_id;


let Insert = () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[row.id,row.technologia_id,row.zamowienie_id,row.id,row.oprawa_id,row.naklad,row.proces_id,row.procesor_id,ID_SPRAWCY]
      var sql =   "INSERT INTO artdruk.technologie_wykonania_oprawa (id,technologia_id,zamowienie_id, grupa_id,oprawa_id,naklad,proces_id,procesor_id,dodal) values (?,?,?,?,?,?,?,?,?); ";
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
          if (err) reject(err); 
           resolve("OK")
        })
})
}





let Status = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[zamowienie_id,grupa_id]
    var sql = "call artdruk.aktualizacja_statusu_oprawy_vs_realizacja(?,?) ";
    connection.execute(sql,data, function (err, result) {    
          if (err) reject(err); 
           resolve("OK")
        })
})

}



let OdwiezGrupe = () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[global_id]
      var sql =   "SELECT status from artdruk.view_technologie_grupy_wykonan_oprawa where global_id=? ";
      connection.execute(sql, data,function (err, result) {     
            if (err) reject(err); 
           resolve(result[0].status)
        })
})
}




try {
let res1 = await  Insert();  // wstaw wykonanie
let res2 = await  Historia(); // dodaj do historii
let res3 = await  Status();  // zmieñ status grupy - w trakcie lub zakoñczone
let nowy_status = await  OdwiezGrupe();  // sprawdza nowy status grupy


// pobierz tylko nowy status i odeślij go aby zaaktualizować
res.status(200).json({status:"OK",insertId : id,status_grupy:nowy_status });
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