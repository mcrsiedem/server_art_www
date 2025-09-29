const { DecodeToken } = require("../logowanie/DecodeToken");
const connection = require("../mysql");

const zakonczArkusz = async (req, res) => {
let row = req.body;  // wykonanie do którego dodawana jest realizacja rozszerzona o zrealizowano
const token = req.params['token']
let id, idRozjazdu;
let ID_SPRAWCY =  DecodeToken(token).id;
const wykonanie_global_id = req.body.global_id;
// console.log("global id wykonania"+row.global_id)
let Insert = () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[row.global_id,row.zrealizowano,row.procesor_id,ID_SPRAWCY,1]
      var sql =   "INSERT INTO artdruk.technologie_realizacje (wykonanie_global_id,zrealizowano,procesor_id,dodal,typ) values (?,?,?,?,?); ";
      connection.execute(sql, data,function (err, result) {     
            if (err) reject(err); 
            id = result.insertId
           resolve("OK")
        })
})
}


let SprawdzIleBrakuje = () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[wykonanie_global_id]
      var sql =   "SELECT sum(zrealizowano) as realizacje from artdruk.view_technologie_realizacje where wykonanie_global_id=?  ";
      connection.execute(sql, data,function (err, result) {     
                  if (err) {
                // throw err
            reject(err); 
            }
            // console.log("Zrealizowano: "+result[0].realizacje)
           resolve(result[0].realizacje || 0)
        })
})
}


let InsertRozjazd = (SUMA_REALIZACJI) =>{ 
    return  new Promise((resolve,reject)=>{

              let BRAKUJACE_PRZELOTY = parseInt(row.przeloty) - parseInt(SUMA_REALIZACJI || 0)
              // console.log(" BRAKUJACE_PRZELOTY: "+ BRAKUJACE_PRZELOTY)
      if(BRAKUJACE_PRZELOTY>0){

  let data=[row.global_id,BRAKUJACE_PRZELOTY,row.procesor_id,ID_SPRAWCY,3]
      var sql =   "INSERT INTO artdruk.technologie_realizacje (wykonanie_global_id,zrealizowano,procesor_id,dodal,typ) values (?,?,?,?,?); ";
      connection.execute(sql, data,function (err, result) {     
            // if (err) reject(err); 
                    if (err) {
                // throw err
            reject(err); 
            }
            idRozjazdu = result.insertId
           resolve(BRAKUJACE_PRZELOTY)
        })
      }else{
        resolve(0)
      }


})
}


let Historia = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[ID_SPRAWCY,row.nazwa,"Zrealizowano: "+row.zrealizowano+" ark. "+"grupa id: "+row.id,row.zamowienie_id]
    var sql =   "INSERT INTO artdruk.zamowienia_historia (user_id,kategoria,event,zamowienie_id) values (?,?,?,?); ";
    connection.execute(sql,data, function (err, result) {    
          if (err) reject(err); 
           resolve("OK")
        })
})
}


let Status = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[row.global_id]
    var sql = "call artdruk.aktualizacja_statusu_wykonania_vs_realizacja(?) ";
    connection.execute(sql,data, function (err, result) {    
          if (err) reject(err); 
           resolve("OK")
        })
})

}

let AktualizacjaNastepnejGrupy = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[row.technologia_id]
    var sql = "call artdruk.aktualizacja_statusow_grup(?) ";
    connection.execute(sql,data, function (err, result) {    
          if (err) reject(err); 
           resolve("OK")
        })
})

}


let OdwiezWykonanie= () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[row.global_id]
      var sql =   "SELECT status, do_wykonania from artdruk.technologie_wykonania where global_id=? ";
      connection.execute(sql, data,function (err, result) {     
            if (err) reject(err); 
           resolve({status:result[0].status, do_wykonania:result[0].do_wykonania})
        })
})
}

let OdwiezGrupe = () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[row.technologia_id,row.grupa_id]
      var sql =   "SELECT status from artdruk.view_technologie_grupy_wykonan where technologia_id=? and id=? ";
      connection.execute(sql, data,function (err, result) {     
            if (err) reject(err); 
           resolve({status_grupy:result[0].status})
        })
})
}


try {
let res1 = await  Insert();  // wstaw wykonanie
let SUMA_REALIZACJI = await  SprawdzIleBrakuje();  // wstaw wykonanie
let BRAKUJACE_PRZELOTY = await  InsertRozjazd(SUMA_REALIZACJI);  // wstaw wykonanie
let res2 = await  Historia(); // dodaj do historii
let res3 = await  Status();  // zmieñ status grupy - w trakcie lub zakoñczone
let res4 = await  OdwiezWykonanie();  // sprawdza nowy status wykonania
let res5 = await  OdwiezGrupe();  // sprawdza nowy status grupy
let res6 = await  AktualizacjaNastepnejGrupy();  // aktualizuj statusy wszystkich grup



 res.status(200).json({status:"OK",insertId : id,status_wykonania:res4.status,do_wykonania:res4.do_wykonania, status_grupy: res5.status_grupy, idRozjazdu:idRozjazdu,brakujace_przeloty:BRAKUJACE_PRZELOTY  });
    } catch (error) {
        // Ten blok przechwyci błąd `err` przekazany przez `reject(err)`
        // z dowolnej z funkcji (Insert, Historia).
        console.error("Wystąpił błąd podczas operacji na bazie danych:", error);
        res.status(200).json({ status: error});
    }
     }


module.exports = {
  zakonczArkusz
};

