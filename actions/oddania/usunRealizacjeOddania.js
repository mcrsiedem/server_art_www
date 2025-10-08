const { DecodeToken } = require("../logowanie/DecodeToken");
const { SendMail } = require("../mail/SendMail");
const connection = require("../mysql");

const usunRealizacjeOddania = async (req, res) => {
let row = req.body;   // wykonanie oddania 
let id_oddania = row.id_grupy  // id Oddania - zawsze 1
let global_id_oddania = row.global_id_grupy  // global_id Oddania



const token = req.params['token']
let ID_SPRAWCY =  DecodeToken(token).id;
let REALIZACJE_USUN =  DecodeToken(token).realizacje_usun || 0;
const zamowienie_id = req.body.zamowienie_id;

let Delete = () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[req.body.global_id,ID_SPRAWCY,REALIZACJE_USUN]
      var sql =   "DELETE from artdruk.oddania_wykonania where global_id=? and (dodal=? or 1=?)";
      connection.execute(sql, data,function (err, result) {     
            if (err) {
              reject("Delete usun realizacja oddania "+err); 
            }else {
           resolve("OK")
            }
       
        })
})
}

let Historia = () =>{ 
    return  new Promise((resolve,reject)=>{
   let data;
      if(row.typ==1){
        data=[ID_SPRAWCY,"Oddania","Usunięto realizację oddania : "+row.zrealizowano+" szt.",zamowienie_id]
      }
  if(row.typ==2){
        data=[ID_SPRAWCY,"Oddania","Usunięto brak nakładu : "+row.zrealizowano+" szt.",zamowienie_id]
      }
    var sql =   "INSERT INTO artdruk.zamowienia_historia (user_id,kategoria,event,zamowienie_id) values (?,?,?,?); ";
    connection.execute(sql,data, function (err, result) {    
                if (err){
                reject("Historia usun realizacja oddania "+err); 
            } else resolve("OK")
        })
})
}

let Status = () =>{ 
    return  new Promise((resolve,reject)=>{
       let data=[zamowienie_id,global_id_oddania]
    var sql = "call artdruk.aktualizacja_statusu_oddania(?,?) ";
    connection.execute(sql,data, function (err, result) {    
          if (err){
                reject("Status usun realizacja oddania "+err); 
            } else resolve("OK")
        })
})

}

let OdwiezGrupe = () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[req.body.oddanie_global_id]
      var sql =   "SELECT status,oddano from artdruk.view_oddania_grupy where global_id=? ";
      connection.execute(sql, data,function (err, result) {     
                  if (err){
                reject("OdwiezGrupe usun realizacja oddania "+err); 
            }  else resolve({status:result[0].status, oddano:result[0].oddano})
        })
  
})
}

try {
let res1 = await  Delete();  // wstaw wykonanie
let res2 = await  Historia(); // dodaj do historii
let res3 = await  Status();  // zmieñ status grupy - w trakcie lub zakoñczone
let res4 = await  OdwiezGrupe();  // sprawdza nowy status grupy

// pobierz tylko nowy status i odeślij go aby zaaktualizować
res.status(200).json({status:"OK",status_grupy:res4.status,oddano:res4.oddano });
    } catch (error) {
      SendMail(error)
        // Ten blok przechwyci błąd `err` przekazany przez `reject(err)`
        // z dowolnej z funkcji (Insert, Historia).
        console.error(error);
        res.status(200).json({ status: error});
    }
     }
module.exports = {
  usunRealizacjeOddania
};
