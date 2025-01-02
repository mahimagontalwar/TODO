"use strict";

var express = require('express');

var Task = require('../models/task');

var authenticate = require('../middlewares/auth');

var _require = require('express-validator'),
    body = _require.body,
    validationResult = _require.validationResult;

var _require2 = require('../validators/taskValidators'),
    validateTask = _require2.validateTask;

var router = express.Router();

var ProjectSchema = require('../models/project');

var _require3 = require('../controllers/taskController'),
    exportTasks = _require3.exportTasks,
    importTasks = _require3.importTasks,
    getTasksWithProjectAndUserAggregation = _require3.getTasksWithProjectAndUserAggregation,
    allDataRoutes = _require3.allDataRoutes;

var _require4 = require('../controllers/taskController'),
    exportTasksAsPDF = _require4.exportTasksAsPDF,
    getTasksWithProjectAndUser = _require4.getTasksWithProjectAndUser; // Route to get tasks with project details


router.get('/with-project-order', authenticate, allDataRoutes); // In tasks.js (routes file)

var multer = require('multer'); // Set up multer for file upload with a file size limit of 10MB


var upload = multer({
  dest: "uploads/",
  // Destination folder for temporary file storage
  limits: {
    fileSize: 10 * 1024 * 1024 // Limit file size to 10MB

  }
});
router.get('/export', authenticate, exportTasks);
router.get('/export/pdf', authenticate, exportTasksAsPDF);
router.post('/import', upload.single('file'), importTasks); // router.post('/import',upload.single('file'), importTasks);
// Define the import route
// // Export tasks as PDF

router.get('/populate', getTasksWithProjectAndUser);
router.get('/aggregation', getTasksWithProjectAndUserAggregation); // Create Task

router.post('/', authenticate, validateTask, body('title').notEmpty().withMessage('Title is required'), function _callee(req, res) {
  var _req$body, title, description, status, projectId, errors, existingTask, task;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, title = _req$body.title, description = _req$body.description, status = _req$body.status, projectId = _req$body.projectId;
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 4:
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(Task.findOne({
            title: title
          }));

        case 7:
          existingTask = _context.sent;

          if (!existingTask) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Task with this title already exists."
          }));

        case 10:
          task = new Task({
            title: title,
            description: description,
            status: status,
            user: req.user._id,
            projectId: projectId
          });
          _context.next = 13;
          return regeneratorRuntime.awrap(task.save());

        case 13:
          res.status(201).json(task);
          _context.next = 19;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](4);
          res.status(500).json({
            message: _context.t0.message
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 16]]);
}); // Get All Tasks with Search and Filter

router.get('/', authenticate, function _callee2(req, res) {
  var filters, tasks;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          // Initialize the filters object
          filters = {
            user: req.user._id
          }; // Ensure it only returns the user's tasks
          // Dynamically add filters if query parameters are present

          if (req.query.title) {
            filters.title = {
              $regex: req.query.title,
              $options: 'i'
            }; // Case-insensitive search
          }

          if (req.query.status) {
            filters.status = req.query.status;
          }

          if (req.query.user) {
            filters.user = req.query.user;
          } // Find tasks using the filters


          _context2.next = 7;
          return regeneratorRuntime.awrap(Task.find(filters));

        case 7:
          tasks = _context2.sent;
          res.json(tasks);
          _context2.next = 14;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: _context2.t0.message
          });

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
}); // Update Task

router.put('/:id', authenticate, function _callee3(req, res) {
  var task;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Task.findById(req.params.id));

        case 3:
          task = _context3.sent;

          if (!(!task || task.user.toString() !== req.user._id)) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Task not found'
          }));

        case 6:
          Object.assign(task, req.body);
          _context3.next = 9;
          return regeneratorRuntime.awrap(task.save());

        case 9:
          res.json(task);
          _context3.next = 15;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            message: _context3.t0.message
          });

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
}); // Delete Task

router["delete"]('/:id', authenticate, function _callee4(req, res) {
  var task;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Task.findByIdAndDelete(req.params.id));

        case 3:
          task = _context4.sent;

          if (!(!task || task.user.toString() !== req.user._id)) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Task not found'
          }));

        case 6:
          // await task.remove();
          res.json({
            message: 'Task deleted'
          });
          _context4.next = 12;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            message: _context4.t0.message
          });

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
module.exports = router;