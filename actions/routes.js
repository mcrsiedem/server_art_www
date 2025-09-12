const express = require('express');
const router = express.Router();
const connections = require('./connections');

const { verifyToken } = require("./logowanie/verifyToken");
const { verifyTokenBody } = require("./logowanie/verifyTokenBody");




const { zapiszTechnologieUpdate } = require("./zapis/ZapiszTechnologieUpdate");
const { zapiszTechnologieInsertDane } = require("./zapis/ZapiszTechnologieInsertDane");
const { zapiszTechnologieInsertProdukty } = require("./zapis/ZapiszTechnologieInsertProdukty");
const { zapiszTechnologieInsertElementy } = require("./zapis/ZapiszTechnologieInsertElementy");
const { zapiszTechnologieInsertFragmenty } = require("./zapis/ZapiszTechnologieInsertFragmenty");
const { zapiszTechnologieInsertOprawa } = require("./zapis/ZapiszTechnologieInsertOprawa");
const { zapiszTechnologieInsertArkusze } = require("./zapis/ZapiszTechnologieInsertArkusze");
const { zapiszTechnologieInsertLegi } = require("./zapis/ZapiszTechnologieInsertLegi");
const { zapiszTechnologieInsertLegiFragmenty } = require("./zapis/ZapiszTechnologieInsertLegiFragmenty");
const { zapiszTechnologieInsertGrupyZamowienia } = require("./zapis/ZapiszTechnologieInsertGrupyZamowienia");
const { zapiszTechnologieInsertGrupyHarmonogram } = require("./zapis/ZapiszTechnologieInsertGrupyHarmonogram");
const { zapiszTechnologieInsertGrupyOprawa } = require("./zapis/ZapiszTechnologieInsertGrupyOprawa");
const { zapiszTechnologieInsertWykonania } = require("./zapis/ZapiszTechnologieInsertWykonania");
const { zapiszTechnologieInsertProcesyElementow } = require("./zapis/ZapiszTechnologieInsertProcesyElementow");

const { zapiszTechnologieInsertGrupyOprawaHarmonogram } = require('./zapis/ZapiszTechnologieInsertGrupyOprawaHarmonogram');
const { zakonczWykonanie } = require('./wykonania/ZakonczWykonanie');
const { ZmienEtapWydrukowane } = require('./wykonania/ZmienEtapWydrukowane');
const { ZamowieniaInfo } = require('./wykonania/ZamowieniaInfo');
const { SendMailPlaner } = require('./mail/SendMailPlaner');
const { ZamowieniaInfoGrupy } = require('./wykonania/ZamowieniaInfoGrupy');
const { ZapiszTechnologieUpdate_restore } = require('./zapis/ZapiszTechnologieUpdate_restore');
const { uprawnienia } = require('./uprawnienia/getUprawnienia');
const { verifyTokenParams } = require('./logowanie/verifyTokenParams');

const { updatePlikiEtapGrupyWykonan } = require('./pliki/updatePlikiEtapGrupyWykonan');
const { updatePlikiEtapZamowienia } = require('./pliki/updatePlikiEtapZamowienia');

const { zamowienieUpdate } = require('./zamowienia/zamowienieUpdate2');
const { zamowienieInsertNumer } = require('./zamowienia/zamowienieInsertNumer2');
const { zamowienieInsert } = require('./zamowienia/zamowienieInsert2');
const { zamowieniePobierzPojedyncze } = require('./zamowienia/zamowieniePobierzPojedyncze2');
const { zamowieniePobierzWszystkie } = require('./zamowienia/zamowieniePobierzWszystkie2');
const { klienciPobierzWszystkich } = require('./klienci/klienciPobierzWszystkich');
const { aktualizujGrupe } = require('./grupa/aktualizujGrupe');
const { aktualizujGrupeOprawaUwagi } = require('./grupa/aktualizujGrupeOprawaUwagi');
const { dodajRealizacjeOprawy } = require('./grupa/dodajRealizacjeOprawy');
const { usunRealizacjeOprawy } = require('./grupa/usunRealizacjeOprawy');
const { zakonczOpraweDodajRealizacje } = require('./grupa/zakonczOprawe');





    router.get('/users/:login/:haslo',connections.getUser);
    router.get('/islogged/:token',verifyToken,connections.isLogged); // weryfikacja tokenu

    // zamówienia
    router.post('/zamowienieNumer/:token',verifyTokenParams('zamowienie_przyjmij'), zamowienieInsertNumer); // dodaje nowe zmówienie
    router.post('/zamowienieInsert/:token',verifyTokenParams('zamowienie_zapis'), zamowienieInsert); // dodaje nowe zmówienie
    router.put('/zapiszZamowienieUpdate/:token',verifyTokenParams('zamowienie_zapis'), zamowienieUpdate); // aktualizacja zamowienia

        router.get('/parametry/:idZamowienia/:token',verifyToken,zamowieniePobierzPojedyncze); // pojedyncze zamówienie do edycji


    router.get('/zamowienia/:orderby/:token',verifyToken,zamowieniePobierzWszystkie);

    router.get('/zamowieniapliki/:token',verifyToken,connections.getZamowieniaPliki);
    router.get('/zamowieniaKalendarz/:token',verifyToken,connections.getZamowieniaKalendarz);     
    router.get('/uprawnienia/:token',verifyTokenParams('uprawnienia_ustaw'),uprawnienia);     



    // technologie promise
        router.get('/technologie_parametry/:idTechnologii/:token',verifyToken,connections.getParametryTechnologii);

    router.post('/zapiszTechnologieInsertDane/:token',verifyTokenParams('technologia_zapis'), zapiszTechnologieInsertDane); // zapisuje technologie
    router.post('/zapiszTechnologieInsertProdukty/:token',verifyTokenParams('technologia_zapis'), zapiszTechnologieInsertProdukty); 
    router.post('/zapiszTechnologieInsertElementy/:token',verifyTokenParams('technologia_zapis'), zapiszTechnologieInsertElementy); 
    router.post('/zapiszTechnologieInsertFragmenty/:token',verifyTokenParams('technologia_zapis'), zapiszTechnologieInsertFragmenty);
    router.post('/zapiszTechnologieInsertOprawa/:token',verifyTokenParams('technologia_zapis'), zapiszTechnologieInsertOprawa); 
    router.post('/zapiszTechnologieInsertArkusze/:token',verifyTokenParams('technologia_zapis'), zapiszTechnologieInsertArkusze); 
    router.post('/zapiszTechnologieInsertLegi/:token',verifyTokenParams('technologia_zapis'), zapiszTechnologieInsertLegi); 
    router.post('/zapiszTechnologieInsertLegiFragmenty/:token',verifyTokenParams('technologia_zapis'), zapiszTechnologieInsertLegiFragmenty);
    router.post('/zapiszTechnologieInsertGrupyZammowienia/:token',verifyTokenParams('technologia_zapis'), zapiszTechnologieInsertGrupyZamowienia); 
    router.post('/zapiszTechnologieInsertGrupyHarmonogram/:token',verifyTokenParams('technologia_zapis'), zapiszTechnologieInsertGrupyHarmonogram); 
    router.post('/zapiszTechnologieInsertGrupyOprawa/:token',verifyTokenParams('technologia_zapis'), zapiszTechnologieInsertGrupyOprawa); 
    router.post('/zapiszTechnologieInsertGrupyOprawaHarmonogram/:token',verifyTokenParams('technologia_zapis'), zapiszTechnologieInsertGrupyOprawaHarmonogram); 
    router.post('/zapiszTechnologieInsertWykonania/:token',verifyTokenParams('technologia_zapis'), zapiszTechnologieInsertWykonania); 
    router.post('/zapiszTechnologieInsertProcesyElementow/:token',verifyTokenParams('technologia_zapis'), zapiszTechnologieInsertProcesyElementow); 
    router.get('/restoreTechnologia/:zamowienie_id/:token',verifyTokenParams('technologia_zapis'), ZapiszTechnologieUpdate_restore); 
    
    // aktualizacja grupy - dodruk arkusza - zmiana parametrów
    router.post('/aktualizuj_grupe_wykonan/:token',verifyTokenParams('manage_druk'), aktualizujGrupe); 
    router.put('/grupa_wykonan_oprawa_uwagi/:token',verifyTokenParams('manage_oprawa'), aktualizujGrupeOprawaUwagi); 
    router.post('/dodaj_realizacje_oprawy/:token',verifyTokenParams('mini_oprawa'), dodajRealizacjeOprawy); // try catch
    router.post('/usun_realizacje_oprawy/:token',verifyTokenParams('mini_oprawa'), usunRealizacjeOprawy); // try catch
    router.post('/zakoncz_oprawe_dodaj_realizacje/:token',verifyTokenParams('mini_oprawa'), zakonczOpraweDodajRealizacje); // try catch

    

    router.put('/zapiszTechnologieUpdate/:token',verifyTokenParams('technologia_zapis'), zapiszTechnologieUpdate); // aktualizacja zamowienia
    router.get('/technologie/:token',verifyToken,connections.getTechnologie);    

    router.get('/papiery-parametry/:token',verifyToken,connections.getPapieryParametry);
    router.get('/sprawdzCzyPapierUzyty/:papier_id/:token',verifyToken,connections.sprawdzCzyPapierUzyty);

    router.get('/lista-papierow/:token',verifyToken,connections.getListaPapierow);
    router.get('/lista-papierow-nazwy/:token',verifyToken,connections.getListaPapierowNazwy);
    router.get('/lista-papierow-grupa/:token',verifyToken,connections.getListaPapierowGrupa);
    router.get('/lista-papierow-postac/:token',verifyToken,connections.getListaPapierowPostac);
    router.get('/lista-papierow-rodzaj/:token',verifyToken,connections.getListaPapierowRodzaj);
    router.get('/lista-papierow-wykonczenia/:token',verifyToken,connections.getListaPapierowWykonczenia);
    router.get('/lista-papierow-powleczenie/:token',verifyToken,connections.getListaPapierowPowleczenie);
    
    router.put('/updatePaper/:token',verifyTokenParams('papier_zapis'),connections.updatePapiery);
    router.put('/updatePaperNazwy/:token',verifyTokenParams('papier_zapis'),connections.updatePapieryNazwy);
    router.put('/updatePaperGrupa/:token',verifyTokenParams('papier_zapis'),connections.updatePapieryGrupa);
    router.get('/nadkomplety/:token',verifyToken,connections.getNadkomplety);
    

    // pliki 
    router.put('/updatePlikiEtapGrupyWykonan/:token',verifyToken,updatePlikiEtapGrupyWykonan); // historia
    router.put('/updatePlikiEtapZamowienia/:token',verifyToken,updatePlikiEtapZamowienia); // historia
    //-----------------------------------------------------------------------------------


    router.put('/updateHistoria/:token',verifyToken,connections.updateHistoria);
    router.put('/updateWydaniePapieru_status/:token',verifyToken,connections.updateWydaniePapieru_status);
    router.post('/insertWydaniePapieru_status/:token',verifyToken,connections.insertWydaniePapieru_status);
    router.post('/insertWydaniePapieru_status_multiselect/:token',verifyToken,connections.insertWydaniePapieru_status_multiselect);
    
    router.put('/zakoncz_proces_elementu_uwolnij_nastepny/:token',verifyToken,connections.zakoncz_proces_elementu_uwolnij_nastepny); //historia
    router.put('/zakoncz_oprawe/:token',verifyToken,connections.zakoncz_oprawe); // historia
    router.put('/zmien_status_przerwy/:token',verifyToken,connections.zmien_status_przerwy);
    router.put('/zakoncz_wykonanie_uwolnij_dalej/:token',verifyToken,zakonczWykonanie); //historia
    router.put('/zmieni_etap_wydrukowane/:token',verifyToken,ZmienEtapWydrukowane);
    router.put('/zamowieniaInfo/:token',verifyToken,ZamowieniaInfo);
    router.put('/zamowieniaInfoGrupy/:token',verifyToken,ZamowieniaInfoGrupy);

    
    router.put('/mail/:token',verifyToken,SendMailPlaner);

    // co to ????
    router.post('/zapis_kosztow_dodatkowych',connections.zapisKosztowDodatkowych);
    router.post('/zapis_kosztow_dodatkowych_zamowienia',connections.zapisKosztowDodatkowychZamowienia);
    router.post('/addKosztDodatkowy',connections.postKoszty);
    router.post('/addKosztDodatkowyZamowienia',connections.postKosztyDodatkoweZamowienia);
    
    router.put('/zamowienia_not_final',connections.updateSetOrderNotFinal);
    router.put('/delete_zamowienie_kosz',connections.updateSetOrderToDeleted);

   

    
    router.get('/lista-procesow',connections.getListaProcesow);
    router.get('/lista-procesow-nazwa',connections.getListaProcesowNazwa);
    router.get('/procesyElementow',connections.getProcesyElementow);
    router.get('/procesory',connections.getProcesory);
    
    router.get('/lista-userow',connections.getUsersM);
// end
// router.get('/lista-klientow/:token',verifyToken,connections.getKlienci);
router.get('/lista-klientow/:token',verifyToken,klienciPobierzWszystkich);

router.get('/lista-produktow',connections.getProdukty);

//Klienci






router.put('/setOrderOpen',connections.setOrderOpen);
router.put('/setOrderClosed',connections.setOrderClosed);




// Technologie nowe2
router.get('/technologie_grupy_an_wykonania_all',connections.getWykonania_i_grupyAll);     
router.get('/technologie_grupy_an_wykonania_for_procesor/:procesor_id',connections.getWykonania_i_grupy_for_procesor);     
router.get('/technologie_grupy_an_wykonania_for_procesor_dni_wstecz/:procesor_id/:dniWstecz',connections.getWykonania_i_grupy_for_procesor_dni_wstecz);     
router.get('/technologie_grupy_an_wykonania_for_procesor_dni_wstecz_oprawa/:procesor_id/:dniWstecz',connections.getWykonania_i_grupy_for_procesor_dni_wstecz_oprawa);     
router.get('/technologie_grupyWykonan/:token',verifyToken,connections.getGrupyAll);     
router.get('/technologie_grupy_oprawa_for_procesor/:procesor_id',connections.getGrupy_oprawa_for_procesor);     
router.get('/drag_drop_proces_grupa/:id_drag_grupa_proces/:id_drop_grupa_proces',connections.dragDropProcesGrup);
router.get('/drag_drop_proces_grupa_oprawa/:id_drag_grupa_proces/:id_drop_grupa_proces',connections.dragDropProcesGrupOprawa);
router.get('/drag_drop_proces_grupa_to_procesor/:id_drag_grupa_proces/:id',connections.dragDropProcesGrupToProcesor);
router.get('/updateWykonania/:global_id_wykonania/:kolumna/:wartosc',connections.updateWykonania);
router.get('/updateWydzielWykonanieZgrupy/:global_id_wykonania',connections.updateWydzielWykonanieZgrupy);
router.get('/updatePrzeniesWykonanieDoInnejGrupy/:global_id_wykonania/:grupa_id_drop/:ostatnie_wykonania',connections.updatePrzeniesWykonanieDoInnejGrupy);
router.get('/updateAddPrzerwa/:global_id_grupa/:czas',connections.updateAddPrzerwa);
router.get('/updateAddPrzerwaOprawa/:global_id_grupa/:czas',connections.updateAddPrzerwaOprawa);
router.get('/updateDeletePrzerwa/:global_id_grupa',connections.updateDeletePrzerwa);
router.get('/updateDeletePrzerwaOprawa/:global_id_grupa',connections.updateDeletePrzerwaOprawa);
router.get('/zmienCzasTrwaniaGrupy/:drop_grupa_global_id/:nowy_koniec',connections.zmienCzasTrwaniaGrupy);
router.get('/zmienCzasTrwaniaGrupyOprawa/:drop_grupa_global_id/:nowy_koniec',connections.zmienCzasTrwaniaGrupyOprawa);
router.get('/zmienCzasTrwaniaGrupyOprawaPrzerwa/:drop_grupa_global_id/:nowy_koniec',connections.zmienCzasTrwaniaGrupyOprawaPrzerwa);
router.get('/zmienCzasTrwaniaGrupyPrzerwa/:drop_grupa_global_id/:nowy_koniec',connections.zmienCzasTrwaniaGrupyPrzerwa);

//Technologia
router.get('/skasujGrupe/:global_id_grupa/:token',verifyTokenParams('technologia_zapis'),connections.skasujGrupe);
router.get('/skasujGrupeOprawa/:global_id_grupa/:token',verifyTokenParams('technologia_zapis'),connections.skasujGrupeOprawa);
router.get('/skasujTechnologie/:id_delete/:zamowienie_id/:user_id/:token',verifyTokenParams('technologia_zapis'),connections.skasujTechnologie);

//Zamowienie
router.delete('/delete_zamowienie/:token',verifyTokenParams('zamowienie_skasuj'),connections.deleteZamowienie);
router.delete('/odblokuj_zamowienie/:token',verifyToken,connections.odblokujZamowienie);




router.get('/backup/:token',verifyTokenParams('technologia_zapis'),connections.backup);


    // klienci
    router.post('/klienci/:token',verifyTokenParams('klienci_zapis'),connections.postKlient);
    router.put('/klient/:token',verifyTokenParams('klienci_usun'),connections.deleteKlient);
    router.put('/updateKlient/:token',verifyTokenParams('klienci_zapis'),connections.updateKlient);

module.exports = router;
