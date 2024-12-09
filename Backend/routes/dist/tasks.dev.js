"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var Task = require('../models/task');

var authenticate = require('../middlewares/auth');

var _require = require('express-validator'),
    body = _require.body,
    validationResult = _require.validationResult;

var _require2 = require('../validators/taskValidators'),
    validateTask = _require2.validateTask;

var router = express.Router();

var _require3 = require('../controllers/taskController'),
    exportTasks = _require3.exportTasks;

var _require4 = require('../controllers/taskController'),
    importTasks = _require4.importTasks;

var _require5 = require('../controllers/taskController'),
    exportTasksAsPDF = _require5.exportTasksAsPDF; // In tasks.js (routes file)


var multer = require('multer'); // Set up multer for file upload with a file size limit of 10MB


var upload = multer({
  dest: "uploads/",
  // Destination folder for temporary file storage
  limits: {
    fileSize: 10 * 1024 * 1024 // Limit file size to 10MB

  }
});
router.get('/export', authenticate, exportTasks); // router.post('/import',upload.single('file'), importTasks);
// Define the import route
// Export tasks as PDF

router.get('/export/pdf', authenticate, exportTasksAsPDF);
router.post('/import', upload.single('file'), importTasks); // Create Task

router.post('/', authenticate, validateTask, body('title').notEmpty().withMessage('Title is required'), function _callee(req, res) {
  var errors, task;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 3:
          _context.prev = 3;
          task = new Task(_objectSpread({}, req.body, {
            user: req.user._id
          }));
          _context.next = 7;
          return regeneratorRuntime.awrap(task.save());

        case 7:
          res.status(201).json(task);
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](3);
          res.status(500).json({
            message: _context.t0.message
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 10]]);
}); // // Get All Tasks
// router.get('/', authenticate, async (req, res) => {
//     try {
//         const tasks = await Task.find({ user: req.user._id });
//         res.json(tasks);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
// Get All Tasks with Search and Filter

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