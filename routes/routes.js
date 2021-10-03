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

//routing

router.get('/zlecenia',zlecenia.getZlecenia);
router.get('/zleceniabyid/:id',zlecenia.getZlecenieById);
router.put('/zlecenia',zlecenia.updateZlecenieOneValue);
router.put('/zleceniaAllValue',zlecenia.updateZlecenieAllValue);
router.post('/zlecenia',zlecenia.postZlecenie);
router.delete('/zlecenia',zlecenia.deleteZlecenie);

router.get('/users/:login/:haslo',users.getUser);
router.get('/druk/:maszyna',druk.getProduktyByMaszyna);
router.put('/druk',druk.dragDropDruk);
router.put('/drukzmienmaszyne',druk.zmienMaszyne);
router.post('/drukduplikuj',druk.duplikujDruk);
router.put('/drukczas',druk.updateCzasDruk);
router.post('/drukprzerwa',druk.insertPrzerwaDruk);
router.delete('/drukprzerwa',druk.deleteProduktSelectOne);



router.get('/ctp',ctp.getCTP);
router.post('/ctp',ctp.postCTP);
router.delete('/ctp',ctp.deleteCTP);
router.put('/ctp',ctp.updateCTP);

router.put('/produkty',produkty.updateProdukty);
router.put('/produktybyidandtyp',produkty.updateProduktyByIdZleceniaAndTyp);
router.get('/produkty/:idzlecenia',produkty.getProduktyById);
router.put('/produktyczasdruku',produkty.updateProduktyCzasDruk);


router.post('/historia',historia.postHistoria);
router.get('/historia',historia.getHistoria);

router.get('/restore',restore.getRestore);
router.delete('/restore',restore.deleteBackup);
router.post('/restore',restore.restoreBackup);
router.put('/restore',restore.updateRestore);
router.post('/createbackup',restore.createBackup);



router.get('/notes',note.getAllNotes);
router.get('/notes/:id',note.getNote);
router.post('/notes',note.saveNote);
router.put('/notes',note.updateNote);
router.delete('/notes',note.deleteNote);

module.exports = router;
