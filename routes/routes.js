const express = require('express');
const router = express.Router();
const druk = require('../actions/druk');


router.get('/zlecenia/:WHEREZLECENIA',druk.getZlecenia);
router.get('/zlecenianieoddane',druk.getZleceniaNieoddane);
router.get('/zleceniamaxnr',druk.getMaxNrZlecenia);
router.get('/zleceniabyid/:id',druk.getZlecenieById);
router.put('/zlecenia',druk.updateZlecenieOneValue);
router.put('/updateStatus',druk.updateStatus);
router.put('/updateStatusZlecenia',druk.updateStatusZlecenia);

router.put('/zleceniaAllValue',druk.updateZlecenieAllValue);
router.post('/zlecenia',druk.postZlecenie);
router.delete('/zlecenia',druk.deleteZlecenie);
router.get('/generujstatusprodukotow',druk.generujStusyProduktow);
router.get('/generujstatuszlecen',druk.generujStusyZlecen);
router.get('/generujnaswietlenia',druk.generujTabeleNaswietlenia_temp);
router.get('/oprawa',druk.loadOprawa);

router.get('/users/:login/:haslo',druk.getUser);
router.get('/druk/:maszyna/:iloscdniwstecz',druk.getProduktyByMaszyna);  // nowe statusy
router.put('/druk',druk.dragDropDruk);
router.put('/drukzmienmaszyne',druk.zmienMaszyne);
router.post('/drukduplikuj',druk.duplikujDruk);

router.put('/drukczas',druk.updateCzasDruk);
router.post('/drukprzerwa',druk.insertPrzerwaDruk);
router.delete('/drukprzerwa',druk.deleteProduktSelectOne);
router.put('/naprawczasdruku',druk.updateNaprawCzas);

//------------------------------
router.get('/ctp',druk.getCTP);
router.post('/ctp',druk.postCTP);
router.delete('/ctp',druk.deleteCTP);
router.put('/ctp',druk.updateCTP);
router.get('/loadtest',druk.loadtest);
//------------------------------
router.put('/produkty',druk.updateProdukty);
router.put('/updateProduktyStatusFalcowanie',druk.updateProduktyStatusFalcowanie);

router.put('/produktydatactp',druk.updateProduktyDataCTP);


router.put('/produktybyidandtyp',druk.updateProduktyByIdZleceniaAndTyp);
router.put('/produktybyidzlecenia',druk.updateProduktyByIdZlecenia);
router.get('/produkty/:idzlecenia',druk.getProduktyById);
router.get('/produktyAll',druk.getProduktyAllH1XLH3);
router.get('/produktyAllnieoddane',druk.getProduktyAllnieoddane);
router.put('/produktyczasdruku',druk.updateProduktyCzasDruk);
router.get('/produkty/:idzlecenia/:typ',druk.getProduktyByIdZleceniAndTyp);

router.get('/listakontrolna',druk.loadListaKontrolna);
router.get('/grupy',druk.loadGrupy);
router.get('/blachy',druk.loadBlachy); // nowe statusy
router.post('/blachylicznik',druk.postBlachyLicznik);
router.post('/blachykopia',druk.postBlachyKopia);
router.delete('/blachy',druk.deleteBlachy);
router.put('/produktyKolejnoscDG',druk.updateKolejnoscZdoluNaGore);
router.put('/produktyKolejnoscGD',druk.updateKolejnoscZgoryNaDol);
//------------------------------
router.post('/historia',druk.postHistoria);
router.get('/historia',druk.getHistoria);
//------------------------------
router.get('/naswietlenia',druk.getNaswietlenia);
router.get('/opisnaswietlen',druk.getOpisNaswietlen);
router.post('/zamknijgrupe',druk.updateZamknijGrupe);
router.put('/updatenaswietlenieprime',druk.updatenaswietlenieprime);
router.put('/updatenaswietlenie',druk.updatenaswietlenie);
router.put('/zmiennanoweswietlenie',druk.zmien_na_nowe_naswietlenie);

router.put('/updatenaswietlenieopis',druk.updatenaswietlenie_opis);
router.post('/duplikujnaswietlenie',druk.duplikujNaswietlenie);


//------------------------------
router.get('/restore',druk.getRestore);
router.delete('/restore',druk.deleteBackup);
router.post('/restore',druk.restoreBackup);
router.put('/restore',druk.updateRestore);
router.post('/createbackup',druk.createBackup);
//------------------------------
router.get('/falcowanie',druk.loadFalcowanie); // nowe statusy
router.get('/okladki/:view',druk.loadOkladki); // nowe statusy
//------------------------------


module.exports = router;
