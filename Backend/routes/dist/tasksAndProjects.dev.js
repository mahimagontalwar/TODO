"use strict";

// routes/tasksAndProjects.js
var express = require('express');

var router = express.Router();

var _require = require('../controllers/taskProjectController'),
    getTasksAndProjects = _require.getTasksAndProjects; // Route to get tasks with associated project details


router.get('/tasks-and-projects', getTasksAndProjects);
module.exports = router;