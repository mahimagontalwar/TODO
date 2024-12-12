"use strict";

// controllers/taskProjectController.js
var Task = require('../models/task');

var Project = require('../models/project');

var getTasksAndProjects = function getTasksAndProjects(req, res) {
  var tasksAndProjects;
  return regeneratorRuntime.async(function getTasksAndProjects$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Task.aggregate([{
            $lookup: {
              from: 'projects',
              // The name of the 'projects' collection in MongoDB
              localField: 'project',
              // The field in 'tasks' that stores the project ID
              foreignField: '_id',
              // The field in 'projects' collection that matches the task's 'project' field
              as: 'projectDetails' // Name of the field in the resulting array to store matched project data

            }
          }, {
            $unwind: {
              path: '$projectDetails',
              // Unwinds the 'projectDetails' array so we get a single project object for each task
              preserveNullAndEmptyArrays: true // Allows for tasks without a project to still be included

            }
          }, {
            $project: {
              _id: 1,
              name: 1,
              description: 1,
              dueDate: 1,
              'projectDetails.name': 1,
              'projectDetails.description': 1,
              'projectDetails.startDate': 1,
              'projectDetails.endDate': 1
            }
          }]));

        case 3:
          tasksAndProjects = _context.sent;

          if (!(tasksAndProjects.length === 0)) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            success: false,
            message: 'No tasks found with project details.'
          }));

        case 6:
          return _context.abrupt("return", res.status(200).json({
            success: true,
            data: tasksAndProjects
          }));

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: 'Server error.'
          }));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

module.exports = {
  getTasksAndProjects: getTasksAndProjects
};