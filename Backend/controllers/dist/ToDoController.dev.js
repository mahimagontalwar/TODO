"use strict";

var Todo = require('../models/Todo');

var path = require('path');

var fs = require('fs'); // Export all todos


exports.exportTodos = function _callee(req, res) {
  var todos;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Todo.find());

        case 3:
          todos = _context.sent;
          res.json(todos);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: 'Error retrieving todos'
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Import todos from a file


exports.importTodos = function (req, res) {
  if (!req.files || !req.files.file) {
    return res.status(400).json({
      message: 'No file uploaded'
    });
  }

  var file = req.files.file;
  var filePath = path.join(__dirname, '..', 'uploads', file.name);
  file.mv(filePath, function (err) {
    if (err) return res.status(500).json({
      message: 'Error saving file'
    });
    return res.status(200).json({
      message: 'File imported successfully'
    });
  });
}; // Create a new Todo


exports.createTodo = function _callee2(req, res) {
  var task, newTodo;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          task = req.body.task;

          if (task) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'Task is required'
          }));

        case 3:
          _context2.prev = 3;
          newTodo = new Todo({
            task: task
          });
          _context2.next = 7;
          return regeneratorRuntime.awrap(newTodo.save());

        case 7:
          res.status(201).json(newTodo);
          _context2.next = 13;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](3);
          res.status(500).json({
            message: 'Error creating todo'
          });

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 10]]);
};