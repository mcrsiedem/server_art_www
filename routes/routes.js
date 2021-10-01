const express = require('express');
const router = express.Router();
const note = require('../actions/note');
const ctp = require('../actions/ctp');
const zlecenia = require('../actions/zlecenia');
const druk = require('../actions/druk');
const historia = require('../actions/historia');
const produkty = require('../actions/produkty');
const users = require('../actions/users');

//routing

router.get('/zlecenia',zlecenia.getZlecenia);
router.put('/zlecenia',zlecenia.updateZlecenieOneValue);
router.post('/zlecenia',zlecenia.postZlecenie);

router.get('/users/:login/:haslo',users.getUser);
router.get('/druk/:maszyna',druk.getProduktyByMaszyna);
router.put('/druk',druk.dragDropDruk);
router.post('/drukduplikuj',druk.duplikujDruk);
router.put('/drukczas',druk.updateCzasDruk);
router.post('/drukprzerwa',druk.insertPrzerwaDruk);
router.delete('/drukprzerwa',druk.deleteProduktSelectOne);



router.get('/ctp',ctp.getCTP);
router.post('/ctp',ctp.postCTP);
router.delete('/ctp',ctp.deleteCTP);
router.put('/ctp',ctp.updateCTP);

router.put('/produkty',produkty.updateProdukty);


router.post('/historia',historia.postHistoria);


router.get('/notes',note.getAllNotes);
router.get('/notes/:id',note.getNote);
router.post('/notes',note.saveNote);
router.put('/notes',note.updateNote);
router.delete('/notes',note.deleteNote);

module.exports = router;
