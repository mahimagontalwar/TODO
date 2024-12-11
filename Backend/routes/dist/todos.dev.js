"use strict";

var express = require('express');

var router = express.Router();

var todoController = require('../controllers/todoController'); // Route for importing todos


router.post('/import', todoController.importTodos); // Route for exporting todos

router.get('/export', todoController.exportTodos);
module.exports = router;