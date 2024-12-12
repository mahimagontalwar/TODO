"use strict";

var express = require('express');

var _require = require('../controllers/projectController'),
    createProject = _require.createProject,
    getProjects = _require.getProjects;

var router = express.Router();
router.post('/', createProject); // Route for fetching all projects

router.get('/', getProjects);
module.exports = router;