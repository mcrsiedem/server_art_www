const { connection, pool } = require("../mysql");

const { DecodeToken } = require("../logowanie/DecodeToken");
const { nazwaElementu } = require("../nazwy/nazwaElementu");
const { nazwaEtapPlikow } = require("../nazwy/nazwaEtapPlikow");
const { SendMail } = require("../mail/SendMail");


 const updatePlikiEtapGrupyWykonan = async (req,res)=>{
  
    //aktualizacja etapu plikow z widoku grupy wykonan tj z maszyn
    const zamowienie_id = req.body.zamowienie_id;
    const element_id = req.body.element_id;
    const etap= req.body.etap;
    const global_id_grupa_row= req.body.global_id_grupa_row;
    const stary_etap= req.body.stary_etap;
    
       const token = req.params['token']
       let ID_SPRAWCY =  DecodeToken(token).id;

let save = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[ID_SPRAWCY,"Pliki",nazwaElementu(element_id)+ ". Zmiana statusu z "+nazwaEtapPlikow(stary_etap)+" na "+nazwaEtapPlikow(etap),zamowienie_id]
    var sql =   "INSERT INTO artdruk.zamowienia_historia (user_id,kategoria,event,zamowienie_id) values (?,?,?,?); ";
    pool.execute(sql,data, function (err, result) {    
        if (err){
                reject(err); 
            } else resolve("OK")
        })
})
}
let save2 = () =>{ 
    return new Promise((resolve,reject)=>{
    var sql =   "call artdruk.update_pliki_etap_grupy_wykonan (" + zamowienie_id+ "," + element_id+ "," + global_id_grupa_row+ "," + etap+ ")"
    pool.query(sql, function (err, result) {
            if (err){
                reject(err); 
            } else resolve("OK")
    
})
})
}

 
let save3 = () =>{ 
    return  new Promise((resolve,reject)=>{
let min
        var sql = "select * from artdruk.view_zamowienia_pliki where zamowienie_id="+zamowienie_id;
        pool.query(sql, function (err, doc) {
        if (err){
                reject(err); 
            } else {
                min = Math.min(...doc.filter(x=> x.zamowienie_id == zamowienie_id ).map((f) => f.etap)) 
                resolve(min)
            }
         
    }

);
    
})
}

let  save4 = (min) => { 
    return new Promise((resolve,reject)=>{
       
    var sql = "update artdruk.zamowienia set etap =" +min+ " where id ="+zamowienie_id;
    pool.query(sql, function (err, result) {
       if (err){
                reject(err); 
            } else resolve("OK")
    })
    
})
}


try{

let res1 = await  save()
let res2 = await  save2()
let min = await  save3()
let res4 = await  save4(min) 
 res.status(200).json('OK');  

} catch (error){
        SendMail(error)
        res.status(200).json('ERROR');  

}

// console.log("p "+res1)
// console.log("m "+res2)
// if ( res1 == 'OK' && res2 == 'OK'){
//     res.json('OK');
// }else{
//     res.json('ERROR');
// }
}


module.exports = {
    updatePlikiEtapGrupyWykonan
    
}
 