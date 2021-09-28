const express = require('express');
const router = express.Router();
const note = require('../actions/note');
const ctp = require('../actions/ctp');
const zlecenia = require('../actions/zlecenia');
const druk = require('../actions/druk');
const historia = require('../actions/historia');
const produkty = require('../actions/produkty');


//routing

router.get('/zlecenia',zlecenia.getZlecenia);
router.put('/zlecenia',zlecenia.updateZlecenieOneValue);


router.get('/druk/:maszyna',druk.getProduktyByMaszyna);
router.put('/druk',druk.dragDropDruk);

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
