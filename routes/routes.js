const express = require('express');
const router = express.Router();
const noteActions = require('../actions/noteActions');

//routing

router.get('/notes',noteActions.getAllNotes);
router.get('/notes/:id',noteActions.getNote);
router.post('/notes',noteActions.saveNote);
router.put('/notes',noteActions.updateNote);
router.delete('/notes',noteActions.deleteNote);

module.exports = router;
