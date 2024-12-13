"use strict";

var express = require('express');

var _require = require('../controllers/projectController'),
    createProject = _require.createProject;

var router = express.Router();
router.post('/', createProject);
module.exports = router;