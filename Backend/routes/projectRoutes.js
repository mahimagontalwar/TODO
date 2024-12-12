const express = require('express');
const { createProject,getProjects } = require('../controllers/projectController');

const router = express.Router();
router.post('/', createProject);
// Route for fetching all projects
router.get('/', getProjects);

module.exports = router;
