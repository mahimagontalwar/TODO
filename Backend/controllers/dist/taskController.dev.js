"use strict";

// In tasksController.js
var Task = require("../models/task");

var Project = require('../models/project');

var Order = require('../models/Order'); // Your Task model


var fs = require("fs");

var mongoose = require('mongoose');

var multer = require("multer"); // Import the PDFKit library


var PDFDocument = require("pdfkit");

var XLSX = require("xlsx");

var upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit

  }
});

var User = require('../models/user'); // Path to your User model


exports.getTasksWithProjectAndUser = function _callee(req, res) {
  var tasks;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Task.find().populate('user', 'name email') // Populate user, selecting name and email fields
          .populate('projectId', 'name description'));

        case 3:
          tasks = _context.sent;
          // Populate projectId, selecting name and description fields
          res.json(tasks);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            error: 'Error fetching tasks with project and user details'
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getTasksWithProjectAndUserAggregation = function _callee2(req, res) {
  var tasks;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Task.aggregate([{
            $lookup: {
              from: 'users',
              // The name of the 'User' collection (in plural form)
              localField: 'user',
              // The field in the Task collection
              foreignField: '_id',
              // The field in the User collection
              as: 'userDetails' // The name of the new field in the result

            }
          }, {
            $unwind: '$userDetails' // Flatten the userDetails array (since $lookup returns an array)

          }, {
            $lookup: {
              from: 'projects',
              // The name of the 'Project' collection (in plural form)
              localField: 'projectId',
              // The field in the Task collection
              foreignField: '_id',
              // The field in the Project collection
              as: 'projectDetails' // The name of the new field in the result

            }
          }, {
            $unwind: '$projectDetails' // Flatten the projectDetails array

          }, {
            $project: {
              // Select which fields to include in the result
              title: 1,
              description: 1,
              status: 1,
              user: {
                // Rename userDetails fields to a more readable structure
                _id: '$userDetails._id',
                name: '$userDetails.name',
                email: '$userDetails.email'
              },
              projectId: {
                // Rename projectDetails fields to a more readable structure
                _id: '$projectDetails._id',
                name: '$projectDetails.name',
                description: '$projectDetails.description'
              }
            }
          }]));

        case 3:
          tasks = _context2.sent;
          res.json(tasks);
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: 'Error fetching tasks with project and user details (aggregation)'
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.allDataRoutes = function _callee3(req, res) {
  var tasks, projects, orders;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Task.aggregate([{
            $lookup: {
              from: 'users',
              // Assuming there's a User collection
              localField: 'user',
              foreignField: '_id',
              as: 'userDetails'
            }
          }, {
            $unwind: '$userDetails'
          }, {
            $project: {
              title: 1,
              description: 1,
              status: 1,
              user: '$userDetails.name' // Assuming the User schema has a name field

            }
          }]));

        case 3:
          tasks = _context3.sent;
          _context3.next = 6;
          return regeneratorRuntime.awrap(Project.aggregate([{
            $project: {
              title: 1,
              description: 1
            }
          }]));

        case 6:
          projects = _context3.sent;
          _context3.next = 9;
          return regeneratorRuntime.awrap(Order.aggregate([{
            $project: {
              orderId: 1,
              totalAmount: 1
            }
          }]));

        case 9:
          orders = _context3.sent;
          // Send the response with all three collections' data
          res.json({
            tasks: tasks,
            projects: projects,
            orders: orders
          });
          _context3.next = 16;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            message: _context3.t0.message
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 13]]);
}; // Import the xlsx library


exports.exportTasks = function _callee4(req, res) {
  var data, transformedData, ExcelJS, workbook, worksheet;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Task.find({
            user: req.user._id
          }, {
            _id: 0
          }));

        case 3:
          data = _context4.sent;
          console.log('Fetched Data:', data);

          if (!(!data || data.length === 0)) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).send("No data found"));

        case 7:
          // Transform data
          transformedData = data.map(function (item) {
            return {
              title: item.title || "",
              description: item.description || "",
              status: item.status || "",
              user: item.user || ""
            };
          });
          console.log('Transformed Data:', transformedData); // Create workbook and worksheet

          ExcelJS = require("exceljs");
          workbook = new ExcelJS.Workbook();
          worksheet = workbook.addWorksheet("Tasks"); // Define columns based on transformed data

          worksheet.columns = [{
            header: "title",
            key: "title",
            width: 30
          }, {
            header: "description",
            key: "description",
            width: 50
          }, {
            header: "status",
            key: "status",
            width: 20
          }, {
            header: "user",
            key: "user",
            width: 20
          }];
          console.log("Excel Columns:", worksheet.columns); // Add rows

          transformedData.forEach(function (row, index) {
            console.log("Adding Row ".concat(index + 1, ":"), row);
            worksheet.addRow(row);
          }); // Set headers for Excel file

          res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
          res.setHeader("Content-Disposition", 'attachment; filename="tasks.xlsx"'); // Write workbook to response

          _context4.next = 19;
          return regeneratorRuntime.awrap(workbook.xlsx.write(res));

        case 19:
          res.end();
          _context4.next = 26;
          break;

        case 22:
          _context4.prev = 22;
          _context4.t0 = _context4["catch"](0);
          console.error("Error exporting tasks:", _context4.t0);

          if (!res.headersSent) {
            res.status(500).send("Error exporting tasks");
          }

        case 26:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

exports.exportTasksAsPDF = function _callee5(req, res) {
  var tasks, transformedData, doc;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;

          if (!(!req.user || !req.user._id)) {
            _context5.next = 4;
            break;
          }

          console.error("Unauthorized: req.user is undefined or invalid");
          return _context5.abrupt("return", res.status(401).send("Unauthorized: User not authenticated"));

        case 4:
          _context5.next = 6;
          return regeneratorRuntime.awrap(Task.find({
            user: req.user._id
          }));

        case 6:
          tasks = _context5.sent;

          if (!(!tasks || tasks.length === 0)) {
            _context5.next = 10;
            break;
          }

          console.log("No tasks found for user:", req.user._id);
          return _context5.abrupt("return", res.status(404).send("No tasks found for the authenticated user"));

        case 10:
          console.log("Fetched Tasks:", tasks); // Transform tasks data

          transformedData = tasks.map(function (task) {
            return {
              title: task.title || "Untitled",
              description: task.description || "No Description",
              status: task.status || "No Status",
              user: task.user || "No User"
            };
          });
          console.log("Transformed Data:", transformedData); // Create a new PDF document

          doc = new PDFDocument(); // Set the response headers for the PDF

          res.setHeader("Content-Type", "application/pdf");
          res.setHeader("Content-Disposition", 'attachment; filename="tasks.pdf"'); // Pipe the document to the response

          doc.pipe(res); // Add Title

          doc.fontSize(20).text("Task List", {
            align: "center"
          });
          doc.moveDown(); // Add tasks data to the PDF

          transformedData.forEach(function (task, index) {
            doc.fontSize(12).text("".concat(index + 1, ". Title: ").concat(task.title)).text("   Description: ".concat(task.description)).text("   Status: ".concat(task.status)).text("   User ID: ".concat(task.user)).moveDown();
          }); // Finalize the PDF and end the response

          doc.end();
          _context5.next = 27;
          break;

        case 23:
          _context5.prev = 23;
          _context5.t0 = _context5["catch"](0);
          console.error("Error exporting tasks as PDF:", _context5.t0); // Send a proper error response only if headers have not already been sent

          if (!res.headersSent) {
            res.status(500).send("Error exporting tasks as PDF");
          }

        case 27:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 23]]);
}; // Controller function to import tasks


exports.importTasks = //   upload.single("file"), // Ensure 'file' matches the form field name
function _callee7(req, res) {
  var file, workbook, sheetName, sheet, tasks;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          // Check if the file is uploaded
          file = req.file;

          if (file) {
            _context7.next = 5;
            break;
          }

          console.log("No file uploaded");
          return _context7.abrupt("return", res.status(400).send("No file uploaded"));

        case 5:
          // Log the file details
          console.log("Received file: ".concat(file.originalname)); // Ensure the uploaded file is an Excel file (optional)

          if (file.mimetype.includes("spreadsheet")) {
            _context7.next = 8;
            break;
          }

          return _context7.abrupt("return", res.status(400).send("Invalid file type. Only Excel files are allowed."));

        case 8:
          // Read the uploaded Excel file
          workbook = XLSX.readFile(file.path);
          sheetName = workbook.SheetNames[0]; // Get the name of the first sheet

          sheet = workbook.Sheets[sheetName]; // Convert the sheet into a JSON array (each row becomes an object)

          _context7.prev = 11;
          tasks = XLSX.utils.sheet_to_json(sheet);
          _context7.next = 19;
          break;

        case 15:
          _context7.prev = 15;
          _context7.t0 = _context7["catch"](11);
          console.error("Error parsing the Excel file:", _context7.t0);
          return _context7.abrupt("return", res.status(400).send("Error parsing the Excel file."));

        case 19:
          _context7.next = 21;
          return regeneratorRuntime.awrap(Promise.all(tasks.map(function _callee6(task) {
            var userId;
            return regeneratorRuntime.async(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    console.log(task); // Sanitize and convert user field to ObjectId

                    if (!task.user) {
                      _context6.next = 9;
                      break;
                    }

                    userId = task.user.replace(/^"(.*)"$/, '$1'); // Remove surrounding quotes if present
                    // Validate the length of the string and make sure it's a valid ObjectId

                    if (!(userId.length === 24 && /^[0-9a-fA-F]{24}$/.test(userId))) {
                      _context6.next = 7;
                      break;
                    }

                    task.user = new mongoose.Types.ObjectId(userId); // Convert to ObjectId using 'new'

                    _context6.next = 9;
                    break;

                  case 7:
                    console.error("Invalid ObjectId format:", userId);
                    return _context6.abrupt("return", res.status(400).send("Invalid ObjectId format."));

                  case 9:
                    // Log the userId to verify
                    console.log("User ID:", task.user); // Insert task into the database

                    return _context6.abrupt("return", Task.create(task));

                  case 11:
                  case "end":
                    return _context6.stop();
                }
              }
            });
          })));

        case 21:
          _context7.next = 23;
          return regeneratorRuntime.awrap(fs.promises.unlink(file.path));

        case 23:
          // Send success response
          res.status(200).send("Tasks imported successfully");
          _context7.next = 30;
          break;

        case 26:
          _context7.prev = 26;
          _context7.t1 = _context7["catch"](0);
          console.error("Error during file upload or processing:", _context7.t1);
          res.status(500).send("Error importing tasks");

        case 30:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 26], [11, 15]]);
};

exports.getTasksWithInstituteAggregation = function _callee8(req, res) {
  var tasks;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(Task.aggregate([// Match stage: Ensure we are getting tasks that have an associated institute
          {
            $match: {
              institute: {
                $ne: null
              }
            }
          }, // Lookup stage: Join with the institutes collection based on the institute reference
          {
            $lookup: {
              from: 'institutes',
              // The name of the institute collection
              localField: 'institute',
              // The field in tasks that references institute
              foreignField: '_id',
              // The _id field in institutes collection
              as: 'instituteDetails' // The field where we want to store the results

            }
          }, // Unwind stage: Flatten the instituteDetails array
          {
            $unwind: '$instituteDetails'
          }, // Optional: Project the fields you want to return
          {
            $project: {
              _id: 1,
              name: 1,
              description: 1,
              dueDate: 1,
              'instituteDetails.name': 1,
              'instituteDetails.location': 1,
              'instituteDetails.type': 1
            }
          }]));

        case 3:
          tasks = _context8.sent;

          if (!(tasks.length === 0)) {
            _context8.next = 6;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            success: false,
            message: 'No tasks found.'
          }));

        case 6:
          res.json({
            success: true,
            data: tasks
          });
          _context8.next = 13;
          break;

        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          res.status(500).json({
            success: false,
            message: 'Server error'
          });

        case 13:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 9]]);
};