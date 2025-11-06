const { DecodeToken } = require("../logowanie/DecodeToken");
const { SendMail } = require("../mail/SendMail");
const { connection, pool } = require("../mysql");

const dodajRealizacjeProcesuBrak = async (req, res) => {
let id;
let row = req.body;
const token = req.params['token']
const wykonanie_global_id = req.body.global_id;
let ID_SPRAWCY =  DecodeToken(token).id;




let SprawdzIleBrakuje = () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[wykonanie_global_id]
      var sql =   "SELECT sum(zrealizowano) as realizacje from artdruk.view_technologie_realizacje where wykonanie_global_id=?  ";
      connection.execute(sql, data,function (err, result) {     
                  if (err) {
                    reject(err);
                  } else {
                    resolve(result[0].realizacje || 0);
                  }
        })
})
}

let Insert = (SUMA_REALIZACJI) =>{ 
    return  new Promise((resolve,reject)=>{

              let BRAKUJACE_PRZELOTY = parseInt(row.przeloty) - parseInt(SUMA_REALIZACJI || 0)
      if(BRAKUJACE_PRZELOTY>0){

  let data=[row.global_id,BRAKUJACE_PRZELOTY,row.procesor_id,ID_SPRAWCY,2]
      var sql =   "INSERT INTO artdruk.technologie_realizacje (wykonanie_global_id,zrealizowano,procesor_id,dodal,typ) values (?,?,?,?,?); ";
      connection.execute(sql, data,function (err, result) {     
                    if (err) {
                      reject(err);
                    } else {
                      id = result.insertId;
                      resolve(BRAKUJACE_PRZELOTY);
                    }
        })

      }else{
        resolve(0)
      }


})
}


let Historia = (BRAKUJACE_PRZELOTY) =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[ID_SPRAWCY,row.nazwa,"Dodano brak: "+BRAKUJACE_PRZELOTY+" ark. "+"grupa id: "+row.id,row.zamowienie_id]
    var sql =   "INSERT INTO artdruk.zamowienia_historia (user_id,kategoria,event,zamowienie_id) values (?,?,?,?); ";
    connection.execute(sql,data, function (err, result) {    
                 if (err) {
                   reject(err);
                 } else {
                   resolve("OK");
                 }
        })
})
}





let Status = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[row.global_id]
    var sql = "call artdruk.aktualizacja_statusu_wykonania_vs_realizacja(?) ";
    connection.execute(sql,data, function (err, result) {    
                  if (err) {
                    reject(err);
                  } else {
                    resolve("OK");
                  }
        })
})

}





let OdwiezWykonanie= () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[row.global_id]
      var sql =   "SELECT status, do_wykonania from artdruk.technologie_wykonania where global_id=? ";
      connection.execute(sql, data,function (err, result) {     
                    if (err) {
                      reject(err);
                    } else {
                      resolve({
                        status: result[0].status,
                        do_wykonania: result[0].do_wykonania,
                      });
                    }
        })
})
}

let OdwiezGrupe = () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[row.technologia_id,row.grupa_id]
      var sql =   "SELECT status from artdruk.view_technologie_grupy_wykonan where technologia_id=? and id=? ";
      connection.execute(sql, data,function (err, result) {     
            if (err) {
              reject(err);
            } else {
              resolve({ status_grupy: result[0].status });
            }
            
        })
})
}





try {

let SUMA_REALIZACJI = await  SprawdzIleBrakuje();  // wstaw wykonanie

let BRAKUJACE_PRZELOTY = await  Insert(SUMA_REALIZACJI);  // wstaw wykonanie
let res2 = await  Historia(BRAKUJACE_PRZELOTY); // dodaj do historii
let res3 = await  Status();  // zmieñ status grupy - w trakcie lub zakoñczone
let res4 = await  OdwiezWykonanie();  // sprawdza nowy status grupy
let res5 = await  OdwiezGrupe();  // sprawdza nowy status grupy


 res.status(200).json({status:"OK",insertId : id,status_wykonania:res4.status,do_wykonania:res4.do_wykonania, status_grupy: res5.status_grupy, brakujace_przeloty:BRAKUJACE_PRZELOTY });
    } catch (error) {

      SendMail(error)
        console.error("Wystąpił błąd podczas operacji na bazie danych:", error);
        res.status(200).json({ status: error});
    }
     }

module.exports = {
  dodajRealizacjeProcesuBrak
};

