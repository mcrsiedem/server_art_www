const express = require('express');
const router = express.Router();
const testActions = require('../actions/api/test');

//routing
router.get('/',testActions.homepage);

module.exports = router;
