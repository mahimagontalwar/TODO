"use strict";

var Project = require('../models/project');

var createProject = function createProject(req, res) {
  var _req$body, name, description, existingProject, newProject;

  return regeneratorRuntime.async(function createProject$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, name = _req$body.name, description = _req$body.description; // Validate request

          if (!(!name || !description)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: 'Both name and description are required.'
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(Project.findOne({
            name: name
          }));

        case 6:
          existingProject = _context.sent;

          if (!existingProject) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "project with this name already exists."
          }));

        case 9:
          // Create a new project
          newProject = new Project({
            name: name,
            description: description // Optional: Initialize with provided tasks or an empty array

          }); // Save the project to the database

          _context.next = 12;
          return regeneratorRuntime.awrap(newProject.save());

        case 12:
          res.status(201).json({
            message: 'Project created successfully',
            name: newProject.name,
            description: newProject.description,
            _id: newProject._id,
            __v: newProject.__v
          });
          _context.next = 18;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            error: _context.t0.message
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var getProjectsWithTasksPopulate = function getProjectsWithTasksPopulate(req, res) {
  var projects;
  return regeneratorRuntime.async(function getProjectsWithTasksPopulate$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Project.find().populate('tasks', 'title description'));

        case 3:
          projects = _context2.sent;
          res.json(projects);
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: 'Error fetching projects with tasks (populate)'
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getProjectsWithTasksAggregation = function getProjectsWithTasksAggregation(req, res) {
  var projects;
  return regeneratorRuntime.async(function getProjectsWithTasksAggregation$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Project.aggregate([// Match stage to filter projects (optional)
          {
            $match: {}
          }, // Lookup stage to join the tasks from the Task collection
          {
            $lookup: {
              from: 'tasks',
              // The name of the tasks collection in MongoDB
              localField: 'tasks',
              // Field in the Project collection containing ObjectIds of tasks
              foreignField: '_id',
              // The _id field in the Task collection
              as: 'tasks' // The alias for the joined tasks

            }
          }, // Project stage to format the response (optional)
          {
            $project: {
              name: 1,
              // Include the project name
              tasks: {
                $map: {
                  input: '$tasks',
                  as: 'task',
                  "in": {
                    title: '$$task.title',
                    description: '$$task.description'
                  }
                }
              }
            }
          }]));

        case 3:
          projects = _context3.sent;
          res.json(projects);
          _context3.next = 11;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.error('Error:', _context3.t0);
          res.status(500).json({
            error: 'Error fetching projects with tasks (aggregation)'
          });

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports = {
  createProject: createProject,
  getProjectsWithTasksPopulate: getProjectsWithTasksPopulate,
  getProjectsWithTasksAggregation: getProjectsWithTasksAggregation
};