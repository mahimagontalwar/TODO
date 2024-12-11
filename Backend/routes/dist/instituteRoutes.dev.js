"use strict";

var express = require('express');

var _require = require('../controllers/instituteController'),
    addInstitute = _require.addInstitute,
    getNearbyInstitutes = _require.getNearbyInstitutes;

var router = express.Router(); // POST: Add a new institute

router.post('/institutes', addInstitute); // GET: Get institutes within 5km radius

router.get('/nearby-institutes', getNearbyInstitutes);
module.exports = router;