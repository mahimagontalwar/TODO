const express = require('express');
const { createProject ,getProjectsWithTasksPopulate,getProjectsWithTasksAggregation } = require('../controllers/projectController');

const router = express.Router();
router.post('/projects', createProject);

router.get('/projects/projects-populate', getProjectsWithTasksPopulate);

router.get('/projects/aggregation', getProjectsWithTasksAggregation);
module.exports = router;
