const express = require('express');
const { addInstitute, getNearbyInstitutes } = require('../controllers/instituteController');

const router = express.Router();

// POST: Add a new institute
router.post('/institutes', addInstitute);

// GET: Get institutes within 5km radius
router.get('/nearby-institutes', getNearbyInstitutes);

module.exports = router;
