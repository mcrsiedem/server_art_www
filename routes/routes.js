const express = require('express');
const router = express.Router();
const note = require('../actions/note');
const ctp = require('../actions/ctp');
const zlecenia = require('../actions/zlecenia');
const druk = require('../actions/druk');
const historia = require('../actions/historia');
const produkty = require('../actions/produkty');
const users = require('../actions/users');
const restore = require('../actions/restore');



router.get('/zlecenia',zlecenia.getZlecenia);
router.get('/zlecenianieoddane',zlecenia.getZleceniaNieoddane);
router.get('/zleceniamaxnr',zlecenia.getMaxNrZlecenia);
router.get('/zleceniabyid/:id',zlecenia.getZlecenieById);
router.put('/zlecenia',zlecenia.updateZlecenieOneValue);
router.put('/updateStatus',zlecenia.updateStatus);
router.put('/updateStatusZlecenia',zlecenia.updateStatusZlecenia);

router.put('/zleceniaAllValue',zlecenia.updateZlecenieAllValue);
router.post('/zlecenia',zlecenia.postZlecenie);
router.delete('/zlecenia',zlecenia.deleteZlecenie);
router.get('/generujstatusprodukotow',zlecenia.generujStusyProduktow);
router.get('/generujstatuszlecen',zlecenia.generujStusyZlecen);
router.get('/generujnaswietlenia',zlecenia.generujTabeleNaswietlenia_temp);

//------------------------------
router.get('/oprawa',zlecenia.loadOprawa);
//------------------------------
router.get('/users/:login/:haslo',users.getUser);
router.get('/druk/:maszyna/:iloscdniwstecz',druk.getProduktyByMaszyna);  // nowe statusy
router.put('/druk',druk.dragDropDruk);
router.put('/drukzmienmaszyne',druk.zmienMaszyne);
router.post('/drukduplikuj',druk.duplikujDruk);

router.put('/drukczas',druk.updateCzasDruk);
router.post('/drukprzerwa',druk.insertPrzerwaDruk);
router.delete('/drukprzerwa',druk.deleteProduktSelectOne);
router.put('/naprawczasdruku',produkty.updateNaprawCzas);

//------------------------------
router.get('/ctp',ctp.getCTP);
router.post('/ctp',ctp.postCTP);
router.delete('/ctp',ctp.deleteCTP);
router.put('/ctp',ctp.updateCTP);
router.get('/loadtest',produkty.loadtest);
//------------------------------
router.put('/produkty',produkty.updateProdukty);
router.put('/updateProduktyStatusFalcowanie',produkty.updateProduktyStatusFalcowanie);

router.put('/produktydatactp',produkty.updateProduktyDataCTP);


router.put('/produktybyidandtyp',produkty.updateProduktyByIdZleceniaAndTyp);
router.put('/produktybyidzlecenia',produkty.updateProduktyByIdZlecenia);
router.get('/produkty/:idzlecenia',produkty.getProduktyById);
router.get('/produktyAll',produkty.getProduktyAllH1XLH3);
router.get('/produktyAllnieoddane',produkty.getProduktyAllnieoddane);
router.put('/produktyczasdruku',produkty.updateProduktyCzasDruk);
router.get('/produkty/:idzlecenia/:typ',produkty.getProduktyByIdZleceniAndTyp);

router.get('/listakontrolna',produkty.loadListaKontrolna);
router.get('/grupy',produkty.loadGrupy);
router.get('/blachy',produkty.loadBlachy); // nowe statusy
router.post('/blachylicznik',produkty.postBlachyLicznik);
router.post('/blachykopia',produkty.postBlachyKopia);
router.delete('/blachy',produkty.deleteBlachy);
router.put('/produktyKolejnoscDG',produkty.updateKolejnoscZdoluNaGore);
router.put('/produktyKolejnoscGD',produkty.updateKolejnoscZgoryNaDol);
//------------------------------
router.post('/historia',historia.postHistoria);
router.get('/historia',historia.getHistoria);
//------------------------------
router.get('/naswietlenia',druk.getNaswietlenia);
router.get('/opisnaswietlen',druk.getOpisNaswietlen);
router.post('/zamknijgrupe',druk.updateZamknijGrupe);
router.put('/updatenaswietlenieprime',produkty.updatenaswietlenieprime);
router.put('/updatenaswietlenie',produkty.updatenaswietlenie);
router.put('/zmiennanoweswietlenie',produkty.zmien_na_nowe_naswietlenie);

router.put('/updatenaswietlenieopis',produkty.updatenaswietlenie_opis);
router.post('/duplikujnaswietlenie',druk.duplikujNaswietlenie);


//------------------------------
router.get('/restore',restore.getRestore);
router.delete('/restore',restore.deleteBackup);
router.post('/restore',restore.restoreBackup);
router.put('/restore',restore.updateRestore);
router.post('/createbackup',restore.createBackup);
//------------------------------
router.get('/falcowanie',produkty.loadFalcowanie); // nowe statusy
router.get('/okladki/:view',produkty.loadOkladki); // nowe statusy
//------------------------------
router.get('/notes',note.getAllNotes);
router.get('/notes/:id',note.getNote);
router.post('/notes',note.saveNote);
router.put('/notes',note.updateNote);
router.delete('/notes',note.deleteNote);

module.exports = router;
