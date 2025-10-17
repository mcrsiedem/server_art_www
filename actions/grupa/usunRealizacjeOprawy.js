const { DecodeToken } = require("../logowanie/DecodeToken");
const connection = require("../mysql");

const usunRealizacjeOprawy = async (req, res) => {
let row = req.body;
let id;
const token = req.params['token']
let ID_SPRAWCY =  DecodeToken(token).id;
let REALIZACJE_USUN =  DecodeToken(token).realizacje_usun || 0;
const zamowienie_id = req.body.zamowienie_id;
const id_grupy = req.body.id_grupy;
const global_id_grupy = req.body.global_id_grupy;

const global_id_wykonania_oprawy = req.body.global_id;


let Delete = () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[global_id_wykonania_oprawy,ID_SPRAWCY,REALIZACJE_USUN]
      var sql =   "DELETE from artdruk.technologie_wykonania_oprawa where global_id=? and (dodal=? or 1=?)";
      connection.execute(sql, data,function (err, result) {     
          //  if (err) console.log(err); 
            if (err) reject(err); 
            id = result.insertId
           resolve("OK")
        })
})
}


let Historia = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[ID_SPRAWCY,"Oprawa","Usunięto realizację oprawy : "+row.naklad+" szt.",zamowienie_id]
    var sql =   "INSERT INTO artdruk.zamowienia_historia (user_id,kategoria,event,zamowienie_id) values (?,?,?,?); ";
    connection.execute(sql,data, function (err, result) {    
          if (err) reject(err); 
           resolve("OK")
        })
})
}





let Status = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[zamowienie_id,id_grupy]
    var sql = "call artdruk.aktualizacja_statusu_oprawy_vs_realizacja(?,?) ";
    connection.execute(sql,data, function (err, result) {    
          if (err) reject(err); 
           resolve("OK")
        })
})

}



let OdwiezGrupe = () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[global_id_grupy]
      var sql =   "SELECT status,zrealizowano from artdruk.view_technologie_grupy_wykonan_oprawa where global_id=? ";
      connection.execute(sql, data,function (err, result) {     
            if (err) reject(err); 
           resolve({status:result[0].status, zrealizowano:result[0].zrealizowano})
        })
})
}




try {
let res1 = await  Delete();  // wstaw wykonanie
let res2 = await  Historia(); // dodaj do historii
let res3 = await  Status();  // zmieñ status grupy - w trakcie lub zakoñczone
let res4 = await  OdwiezGrupe();  // sprawdza nowy status grupy


// pobierz tylko nowy status i odeślij go aby zaaktualizować
res.status(200).json({status:"OK",insertId : id,status_grupy:res4.status,zrealizowano:res4.zrealizowano });
    } catch (error) {
        // Ten blok przechwyci błąd `err` przekazany przez `reject(err)`
        // z dowolnej z funkcji (Insert, Historia).
        console.error("Wystąpił błąd podczas operacji na bazie danych:", error);
        res.status(200).json({ status: error});
    }
     }


module.exports = {
  usunRealizacjeOprawy
};


// let res1 = await save().catch(error => {
//         console.error("Błąd w save():", error);
//         res.status(500).json({ error: "Błąd podczas zapisywania." });
//     });