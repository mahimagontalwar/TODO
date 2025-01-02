"use strict";

var express = require('express');

var _require = require('../controllers/projectController'),
    createProject = _require.createProject,
    getProjects = _require.getProjects,
    getProjectsWithTasksPopulate = _require.getProjectsWithTasksPopulate,
    getProjectsWithTasksAggregation = _require.getProjectsWithTasksAggregation;

var router = express.Router();
router.post('/projects', createProject);
router.get('/projects', getProjects);
router.get('/projects/projects-populate', getProjectsWithTasksPopulate);
router.get('/projects/aggregation', getProjectsWithTasksAggregation);
module.exports = router;