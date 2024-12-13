"use strict";

var Project = require('../models/project');

var createProject = function createProject(req, res) {
  var _req$body, title, description, existingProject, newProject;

  return regeneratorRuntime.async(function createProject$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, title = _req$body.title, description = _req$body.description; // Validate request

          if (!(!title || !description)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: 'Both title and description are required.'
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(Project.findOne({
            title: title
          }));

        case 6:
          existingProject = _context.sent;

          if (!existingProject) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "project with this title already exists."
          }));

        case 9:
          // Create a new project
          newProject = new Project({
            title: title,
            description: description // Optional: Initialize with provided tasks or an empty array

          }); // Save the project to the database

          _context.next = 12;
          return regeneratorRuntime.awrap(newProject.save());

        case 12:
          res.status(201).json({
            message: 'Project created successfully',
            title: newProject.title,
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

module.exports = {
  createProject: createProject
};