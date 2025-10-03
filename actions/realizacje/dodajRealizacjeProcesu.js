const { DecodeToken } = require("../logowanie/DecodeToken");
const { transporter } = require("../mail/mail");
const { SendMail } = require("../mail/SendMail");
const { SendMailPlaner } = require("../mail/SendMailPlaner");
const connection = require("../mysql");

const dodajRealizacjeProcesu = async (req, res) => {
let row = req.body;  // wykonanie do którego dodawana jest realizacja rozszerzona o zrealizowano
const token = req.params['token']
let id;
let ID_SPRAWCY =  DecodeToken(token).id;

let wizytowka = "User: "+ ID_SPRAWCY+ " Wykonanie global_id: "+row.global_id + " Procesor: "+row.procesor_id

// console.log("global id wykonania"+row.global_id)
let Insert = () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[row.global_id,row.zrealizowano,row.procesor_id,ID_SPRAWCY,1]
      var sql =   "INSERT INTO artdruk.technologie_realizacje (wykonanie_global_id,zrealizowano,procesor_id,dodal,typ) values (?,?,?,?,?); ";
      connection.execute(sql, data,function (err, result) {     
       if (err){
                reject(wizytowka+" Insert "+err); 
            } resolve("OK")
        })
})
}


let Historia = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[ID_SPRAWCY,row.nazwa,"Zrealizowano: "+row.zrealizowano+" ark. "+"grupa id: "+row.id,row.zamowienie_id]
    var sql =   "INSERT INTO artdruk.zamowienia_historia (user_id,kategoria,event,zamowienie_id) values (?,?,?,?); ";
    connection.execute(sql,data, function (err, result) {    
        if (err){
                reject(wizytowka+" Historia "+err); 
            }  resolve("OK")
        })
})
}


let Status = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[row.global_id]
    var sql = "call artdruk.aktualizacja_statusu_wykonania_vs_realizacja(?) ";
    connection.execute(sql,data, function (err, result) {    
         if (err){
                reject(wizytowka+" Status "+err); 
            }  resolve("OK")
        })
})

}

let AktualizacjaNastepnejGrupy = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[row.technologia_id]
    var sql = "call artdruk.aktualizacja_statusow_grup(?) ";
    connection.execute(sql,data, function (err, result) {    
        if (err){
                reject(wizytowka+" AktualizacjaNastepnejGrupy "+err); 
            } else resolve("OK")
        })
})

}


let OdwiezWykonanie= () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[row.global_id]
      var sql =   "SELECT status, do_wykonania from artdruk.technologie_wykonania where global_id=? ";
      connection.execute(sql, data,function (err, result) {     
            if (err){

                reject(wizytowka+" OdwiezWykonanie "+err); 
            } else            resolve({status:result[0]?.status ||0, do_wykonania:result[0]?.do_wykonania ||0})
        })
})
}

let OdwiezGrupe = () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[row.technologia_id,row.grupa_id]
      var sql =   "SELECT status from artdruk.view_technologie_grupy_wykonan where technologia_id=? and id=? ";
      connection.execute(sql, data,function (err, result) {     
                  if (err){
                reject(wizytowka+" OdwiezGrupe "+err); 
            } else  resolve({status_grupy:result[0].status })
        })
})
}


try {
let res1 = await  Insert();  // wstaw wykonanie
let res2 = await  Historia(); // dodaj do historii
let res3 = await  Status();  // zmieñ status grupy - w trakcie lub zakoñczone
let res4 = await  OdwiezWykonanie() // sprawdza nowy status grupy;  // sprawdza nowy status wykonania
let res5 = await  OdwiezGrupe()
let res6 = await  AktualizacjaNastepnejGrupy();  // aktualizuj statusy wszystkich grup




 res.status(200).json({status:"OK",insertId : id,status_wykonania:res4.status,do_wykonania:res4.do_wykonania, status_grupy: res5.status_grupy });
    } catch (error) {

        SendMail(error)

        console.error("Wystąpił błąd podczas operacji na bazie danych:", error);
        res.status(200).json({ status: error});
    }
     }


module.exports = {
  dodajRealizacjeProcesu
};

