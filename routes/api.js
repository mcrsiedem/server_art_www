const express = require('express');
const router = express.Router();
const noteActions = require('../actions/api/notes');

//routing
// router.get('/',noteActions.homepage);
// router.get('/sel',testActions.sel);
router.get('/',noteActions.saveNote);


module.exports = router;
