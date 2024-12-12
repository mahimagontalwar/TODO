"use strict";

var Project = require('../models/project');

var createProject = function createProject(req, res) {
  var _req$body, name, description, startDate, endDate, newProject, savedProject;

  return regeneratorRuntime.async(function createProject$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, description = _req$body.description, startDate = _req$body.startDate, endDate = _req$body.endDate; // Validate that all required fields are provided

          if (!(!name || !description || !startDate || !endDate)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: 'Please provide all required fields: name, description, startDate, and endDate.'
          }));

        case 3:
          _context.prev = 3;
          // Create a new project with the provided data
          newProject = new Project({
            name: name,
            description: description,
            startDate: startDate,
            endDate: endDate
          }); // Save the project to the database

          _context.next = 7;
          return regeneratorRuntime.awrap(newProject.save());

        case 7:
          savedProject = _context.sent;
          // Return the saved project
          res.status(201).json({
            success: true,
            data: savedProject
          });
          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](3);
          console.error(_context.t0);
          res.status(500).json({
            success: false,
            message: 'Server error. Could not create project.'
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 11]]);
}; // Get all projects


var getProjects = function getProjects(req, res) {
  var projects;
  return regeneratorRuntime.async(function getProjects$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Project.find());

        case 3:
          projects = _context2.sent;

          if (!(projects.length === 0)) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            success: false,
            message: 'No projects found.'
          }));

        case 6:
          res.json({
            success: true,
            data: projects
          });
          _context2.next = 13;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          res.status(500).json({
            success: false,
            message: 'Server error'
          });

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

module.exports = {
  createProject: createProject,
  getProjects: getProjects
};