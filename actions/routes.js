const express = require('express');
const router = express.Router();
const connections = require('./connections');
const connection = require("./mysql");
const jwt = require("jsonwebtoken");
const cookieParser =require("cookie-parser");
const multer =require("multer");
const ACCESS_TOKEN ='mcsdfsdg43sgkbajg45kt234ojgsdfsd234fsdkufgdgfdfg32423';




function isLogged(req,res){
  //  przed wywyłaniem tej fukncji sprawdzany jest verifyToken jako middleware w endpoincie


 return res.json({Status: "Success"});
}

const verifyToken=(req,res,next) =>{
    const token = req.params['token']

//    console.log("token z cookie! "+token)
    if(!token){
        return res.json({Error: "You are not Authenticated"});
    } else {
        jwt.verify(token,ACCESS_TOKEN,(err,decoded)=>{
            if(err) return res.json({Error: "Wrong token"});
            next();
        })
    }
    //console.log("next");
}
//s
const verifyTokenBody=(req,res,next) =>{

    const token= req.body.token;
   //console.log("token z cookie! "+token)
    if(!token){
        return res.json({Error: "You are not Authenticated"});
    } else {
        jwt.verify(token,ACCESS_TOKEN,(err,decoded)=>{
            if(err) return res.json({Error: "Wrong token"});
            next();
        })
    }
    //console.log("next");
}







function getUser(req,res){

    const login = req.params['login']
    const haslo = req.params['haslo']


var sql =   "INSERT INTO historia (User,Kategoria,Event,Klient) "+
"values ('" + login + "','Logowanie','" + haslo + "','www'); ";
connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(" 1 record inserted "+result.insertId);
        // res.status(201).json(result);
        })


    var sql = "select id,imie,nazwisko,login,haslo,dostep from artdruk.users where login ='" + login + "' and haslo = '" + haslo + "';";
    connection.query(sql,  (err, result) => {

        if(err) return res.json({Status: "Error", Error: "Error in running query"})
        if(result.length >0 ){
                    const id = result[0].id;
                    const imie = result[0].imie;
                    const nazwisko = result[0].nazwisko;
                    const dostep = result[0].dostep;
                    const paylod = {
                        id,
                        imie,
                        nazwisko,
                        login,
                        dostep
                    }
 
           const token = jwt.sign(paylod, ACCESS_TOKEN, {expiresIn:'8h'});
        //      res.cookie('token', token);
        //   //   res.send("cooo")
            return res.status(200).json(token)
            
    
        } else {
            return res.json({Status: "Error", Error: "Wrong Email or Password"})
        }

    // connection.query(sql,  (err, doc) => { 
    // if (err) throw err;
    // res.status(200).json(result);
}
);

}  

router.get('/users/:login/:haslo',getUser);



// weryfikacja tokenu
router.get('/islogged/:token',verifyToken,isLogged);

// aktualizacja ilość blach w druku row.js
router.put('/updatenaswietlenieprimewww',verifyTokenBody,connections.updatenaswietlenieprime);

//  aktualizacja statusów druku w row.js
router.put('/updateStatusWWW',verifyTokenBody,connections.updateStatusWWW);



// nie wiem czy sie udalo 
// zlecenia
router.post('/zlecenia',connections.postZlecenie);
router.post('/zlecenia_z_excela',connections.postZlecenia_z_EXCELA);

router.delete('/zlecenia',connections.deleteZlecenie);
router.delete('/delete_zamowienie',connections.deleteZamowienie);


// zamaówienie nowe
    router.get('/parametry/:idZamowienia/:zamowienie_prime_id',connections.getParametry);
    router.get('/zamowienia',connections.getZamowienia);
    // router.post('/zamowienie',connections.postZamowienie);
    router.post('/zamowienie_new',connections.postZamowienieNew);
    router.post('/zapis_kosztow_dodatkowych',connections.zapisKosztowDodatkowych);
    router.post('/zapis_kosztow_dodatkowych_zamowienia',connections.zapisKosztowDodatkowychZamowienia);

    // router.post('/zamowienieobj',connections.postZamowienieObj);
    // router.post('/produkty',connections.postProdukty);
    // router.post('/elementy',connections.postElementy);
    // router.post('/fragmenty',connections.postFragmenty);
    // router.post('/pakowanie',connections.postPakowanie);
    router.post('/addKosztDodatkowy',connections.postKoszty);
    router.post('/addKosztDodatkowyZamowienia',connections.postKosztyDodatkoweZamowienia);
    

    router.post('/procesyElementow',connections.postProcesyElementow);
    router.put('/zamowienia_not_final',connections.updateSetOrderNotFinal);
    router.put('/delete_zamowienie_kosz',connections.updateSetOrderToDeleted);

   
    // router.get('/lista-uszlachetnien',connections.getListaUszlachetnien);
    // router.get('/lista-wykonczen',connections.getListaWykonczen);
    router.get('/lista-papierow',connections.getListaPapierow);
    router.get('/lista-papierow-nazwy',connections.getListaPapierowNazwy);
    router.get('/lista-procesow',connections.getListaProcesow);
    router.get('/lista-procesow-nazwa',connections.getListaProcesowNazwa);
    router.get('/procesyElementow',connections.getProcesyElementow);
    router.get('/procesory',connections.getProcesory);
    
    router.get('/lista-userow',connections.getUsersM);
// end
router.get('/lista-klientow',connections.getKlienci);
router.get('/lista-opraw',connections.getOprawy);
router.get('/lista-produktow',connections.getProdukty);
router.post('/klienci',connections.postKlient);
router.put('/klient',connections.deleteKlient);
router.put('/updateKlient',connections.updateKlient);
router.put('/setOrderOpen',connections.setOrderOpen);
router.put('/setOrderClosed',connections.setOrderClosed);

// Technologie nowe2
router.get('/technologie_parametry/:idTechnologii',connections.getParametryTechnologii);
router.get('/technologie_grupy_an_wykonania_all',connections.getWykonania_i_grupyAll);     
router.get('/technologie',connections.getTechnologie);     
router.post('/technologie',connections.postTechnologie); 
router.post('/technologie_new',connections.postTechnologieNew); 
router.post('/technologie_rest',connections.postTechnologieRest); 
router.put('/technologia_not_final',connections.updateSetTechNotFinal);  


// Technologie nowe end

// router.get('/zlecenia/:WHEREZLECENIA',connections.getZlecenia);
// router.get('/zlecenianieoddane',connections.getZleceniaNieoddane);
// router.get('/zleceniamaxnr',connections.getMaxNrZlecenia);
// router.get('/zleceniabyid/:id',connections.getZlecenieById);
// router.put('/zlecenia',connections.updateZlecenieOneValue);
// router.put('/zleceniaAllValue',connections.updateZlecenieAllValue);


// // papier_stan

// router.put('/updatePapierStanOneValue',connections.updatePapierStanOneValue);
// router.get('/getPapierStan',connections.getPapierStan);


// router.get('/ctp',connections.getCTP);
// router.post('/ctp',connections.postCTP);
// router.delete('/ctp',connections.deleteCTP);
// router.put('/ctp',connections.updateCTP);

// router.put('/produktydatactp',connections.updateProduktyDataCTP);
// router.put('/produktybyidandtyp',connections.updateProduktyByIdZleceniaAndTyp);
// router.put('/produktybyidzlecenia',connections.updateProduktyByIdZlecenia);
// router.get('/produkty/:idzlecenia',connections.getProduktyById);
// router.get('/produktyAll',connections.getProduktyAllH1XLH3);
// router.get('/produktyAllnieoddane',connections.getProduktyAllnieoddane);
// router.put('/produktyczasdruku',connections.updateProduktyCzasDruk);
// router.get('/produkty/:idzlecenia/:typ',connections.getProduktyByIdZleceniAndTyp);






// router.put('/updateStatus',connections.updateStatus);
// router.put('/updateStatusZlecenia',connections.updateStatusZlecenia);



// router.get('/generujstatusprodukotow',connections.generujStusyProduktow);
// router.get('/generujstatuszlecen',connections.generujStusyZlecen);
// router.get('/generujnaswietlenia',connections.generujTabeleNaswietlenia_temp);
// router.get('/generujDostawy_temp',connections.generujDostawy_temp);


// router.get('/oprawa',connections.loadOprawa);


// router.get('/usersjava/:login/:haslo',connections.getUserJava);

// router.get('/druk/:maszyna/:iloscdniwstecz',connections.getProduktyByMaszyna);  // nowe statusy
// router.get('/druk_papier/:maszyna/:iloscdniwstecz',connections.getProdukty_do_wydania_papieru);  


// router.put('/druk',connections.dragDropDruk);
// router.put('/drukzmienmaszyne',connections.zmienMaszyne);
// router.post('/drukduplikuj',connections.duplikujDruk);

// router.put('/drukczas',connections.updateCzasDruk);
// router.post('/drukprzerwa',connections.insertPrzerwaDruk);
// router.delete('/drukprzerwa',connections.deleteProduktSelectOne);
// router.put('/naprawczasdruku',connections.updateNaprawCzas);

// //------------------------------
// router.get('/loadtest',connections.loadtest);
// //------------------------------
// router.put('/produkty',connections.updateProdukty);
// router.put('/updateProduktyStatusFalcowanie',connections.updateProduktyStatusFalcowanie);

// router.get('/listakontrolna',connections.loadListaKontrolna);
// router.get('/grupy',connections.loadGrupy);
// router.get('/blachy',connections.loadBlachy); // nowe statusy
// router.post('/blachylicznik',connections.postBlachyLicznik);
// router.post('/blachykopia',connections.postBlachyKopia);
// router.delete('/blachy',connections.deleteBlachy);
// router.put('/produktyKolejnoscDG',connections.updateKolejnoscZdoluNaGore);
// router.put('/produktyKolejnoscGD',connections.updateKolejnoscZgoryNaDol);
// //------------------------------
// router.post('/historia',connections.postHistoria);
// router.get('/historia',connections.getHistoria);
// router.get('/historia_short',connections.getHistoria_short);

// //------------------------------

// router.get('/magazyn_zamowienia',connections.getMagazynZamowienia);
// router.get('/magazyn_dostawy',connections.getMagazynDostawy);
// router.get('/magazyn_listy',connections.getMagazynListy);
// router.get('/magazyn_zaladunki',connections.getMagazynZaladunki);
// router.get('/magazyn_palety',connections.getMagazynPalety);

// router.get('/naswietlenia',connections.getNaswietlenia);

// router.get('/opisnaswietlen',connections.getOpisNaswietlen);
// router.post('/zamknijgrupe',connections.updateZamknijGrupe);
// router.put('/updatenaswietlenieprime',connections.updatenaswietlenieprime);
// router.put('/updatenaswietlenie',connections.updatenaswietlenie);
// router.put('/updatenaswietlenie_grupa',connections.updatenaswietlenie_grupa);

// router.put('/zmiennanoweswietlenie',connections.zmien_na_nowe_naswietlenie);

// router.put('/updatenaswietlenieopis',connections.updatenaswietlenie_opis);
// router.post('/duplikujnaswietlenie',connections.duplikujNaswietlenie);

// //------------------------------
// router.get('/restore',connections.getRestore);
// router.delete('/restore',connections.deleteBackup);
// router.post('/restore',connections.restoreBackup);
// router.put('/restore',connections.updateRestore);
// router.post('/createbackup',connections.createBackup);
// //------------------------------
// router.get('/falcowanie',connections.loadFalcowanie); // nowe statusy
// router.get('/okladki/:view',connections.loadOkladki); // nowe statusy
// //------------------------------


module.exports = router;
