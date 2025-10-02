const { DecodeToken } = require("../logowanie/DecodeToken");
const connection = require("../mysql");

const zakonczOddanieDodajeWykonanie = async (req, res) => {
let row = req.body;
let id;
const token = req.params['token']
let ID_SPRAWCY =  DecodeToken(token).id;

const zamowienie_id = req.body.zamowienie_id;
const grupa_id = req.body.id;

const oddanie_global_id = req.body.global_id;



let SprawdzIleBrakuje = () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[oddanie_global_id]
      var sql =   "SELECT sum(zrealizowano) as realizacje from artdruk.oddania_wykonania where oddanie_global_id=?";
      connection.execute(sql, data,function (err, result) {     
            if (err) reject(err); 
           resolve(result[0].realizacje)
        })
})
}

let Insert = (SUMA_REALIZACJI) =>{ 
    return  new Promise((resolve,reject)=>{
      let BRAKUJACY_NAKLAD = parseInt(row.naklad) - parseInt(SUMA_REALIZACJI || 0)
      if(BRAKUJACY_NAKLAD>0){

          let data=[row.zamowienie_id,req.body.global_id,BRAKUJACY_NAKLAD,ID_SPRAWCY,1]
      var sql =   "INSERT INTO artdruk.oddania_wykonania (zamowienie_id,oddanie_global_id, zrealizowano,dodal,typ) values (?,?,?,?,?); ";
      connection.execute(sql, data,function (err, result) {     
          //  if (err) throw err; 
            if (err) reject(err); 
            id = result.insertId
           resolve(BRAKUJACY_NAKLAD)
        })
      }else {
        resolve("OK")
      }


})
}


let Historia = (BRAKUJACY_NAKLAD) =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[ID_SPRAWCY,"Oddanie","Oddano "+BRAKUJACY_NAKLAD+" szt.",zamowienie_id]
    var sql =   "INSERT INTO artdruk.zamowienia_historia (user_id,kategoria,event,zamowienie_id) values (?,?,?,?); ";
    connection.execute(sql,data, function (err, result) {    
          if (err) reject(err); 
           resolve("OK")
        })
})
}

/// tuuuuuuu



let Status = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[zamowienie_id,req.body.global_id]
    var sql = "call artdruk.aktualizacja_statusu_oddania(?,?) ";
    connection.execute(sql,data, function (err, result) {    
          if (err) reject(err); 
           resolve("OK")
        })
})

}



let OdwiezGrupe = () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[req.body.global_id]
      var sql =   "SELECT status,oddano from artdruk.view_oddania_grupy where global_id=? ";
      connection.execute(sql, data,function (err, result) {     
            if (err) reject(err); 
           resolve({status:result[0].status, oddano:result[0].oddano})
        })
})
}




try {
let SUMA_REALIZACJI = await  SprawdzIleBrakuje();  // wstaw wykonanie
let BRAKUJACY_NAKLAD = await  Insert(SUMA_REALIZACJI);  // wstaw wykonanie
let res2 = await  Historia(BRAKUJACY_NAKLAD); // dodaj do historii
let res3 = await  Status();  // zmieñ status grupy - w trakcie lub zakoñczone
let res4 = await  OdwiezGrupe();  // sprawdza nowy status grupy


// pobierz tylko nowy status i odeślij go aby zaaktualizować
res.status(200).json({status:"OK",insertId : id || 0,status_grupy:res4.status, brakujacy_naklad:BRAKUJACY_NAKLAD,oddano:res4.oddano });
    } catch (error) {
        // Ten blok przechwyci błąd `err` przekazany przez `reject(err)`
        // z dowolnej z funkcji (Insert, Historia).
        console.error("Wystąpił błąd podczas operacji na bazie danych:", error);
        res.status(200).json({ status: error});
    }
     }


module.exports = {
  zakonczOddanieDodajeWykonanie
};


// let res1 = await save().catch(error => {
//         console.error("Błąd w save():", error);
//         res.status(500).json({ error: "Błąd podczas zapisywania." });
//     });