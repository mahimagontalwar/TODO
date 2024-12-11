"use strict";

// In tasksController.js
var Task = require("../models/task"); // Your Task model


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
}); // Import the xlsx library

exports.exportTasks = function _callee(req, res) {
  var data, transformedData, ExcelJS, workbook, worksheet;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Task.find({
            user: req.user._id
          }, {
            _id: 0
          }));

        case 3:
          data = _context.sent;
          console.log('Fetched Data:', data);

          if (!(!data || data.length === 0)) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(404).send("No data found"));

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

          _context.next = 19;
          return regeneratorRuntime.awrap(workbook.xlsx.write(res));

        case 19:
          res.end();
          _context.next = 26;
          break;

        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](0);
          console.error("Error exporting tasks:", _context.t0);

          if (!res.headersSent) {
            res.status(500).send("Error exporting tasks");
          }

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

exports.exportTasksAsPDF = function _callee2(req, res) {
  var tasks, transformedData, doc;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          if (!(!req.user || !req.user._id)) {
            _context2.next = 4;
            break;
          }

          console.error("Unauthorized: req.user is undefined or invalid");
          return _context2.abrupt("return", res.status(401).send("Unauthorized: User not authenticated"));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(Task.find({
            user: req.user._id
          }));

        case 6:
          tasks = _context2.sent;

          if (!(!tasks || tasks.length === 0)) {
            _context2.next = 10;
            break;
          }

          console.log("No tasks found for user:", req.user._id);
          return _context2.abrupt("return", res.status(404).send("No tasks found for the authenticated user"));

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
          _context2.next = 27;
          break;

        case 23:
          _context2.prev = 23;
          _context2.t0 = _context2["catch"](0);
          console.error("Error exporting tasks as PDF:", _context2.t0); // Send a proper error response only if headers have not already been sent

          if (!res.headersSent) {
            res.status(500).send("Error exporting tasks as PDF");
          }

        case 27:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 23]]);
}; // Controller function to import tasks


exports.importTasks = //   upload.single("file"), // Ensure 'file' matches the form field name
function _callee4(req, res) {
  var file, workbook, sheetName, sheet, tasks;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          // Check if the file is uploaded
          file = req.file;

          if (file) {
            _context4.next = 5;
            break;
          }

          console.log("No file uploaded");
          return _context4.abrupt("return", res.status(400).send("No file uploaded"));

        case 5:
          // Log the file details
          console.log("Received file: ".concat(file.originalname)); // Ensure the uploaded file is an Excel file (optional)

          if (file.mimetype.includes("spreadsheet")) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(400).send("Invalid file type. Only Excel files are allowed."));

        case 8:
          // Read the uploaded Excel file
          workbook = XLSX.readFile(file.path);
          sheetName = workbook.SheetNames[0]; // Get the name of the first sheet

          sheet = workbook.Sheets[sheetName]; // Convert the sheet into a JSON array (each row becomes an object)

          _context4.prev = 11;
          tasks = XLSX.utils.sheet_to_json(sheet);
          _context4.next = 19;
          break;

        case 15:
          _context4.prev = 15;
          _context4.t0 = _context4["catch"](11);
          console.error("Error parsing the Excel file:", _context4.t0);
          return _context4.abrupt("return", res.status(400).send("Error parsing the Excel file."));

        case 19:
          _context4.next = 21;
          return regeneratorRuntime.awrap(Promise.all(tasks.map(function _callee3(task) {
            var userId;
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    console.log(task); // Sanitize and convert user field to ObjectId

                    if (!task.user) {
                      _context3.next = 9;
                      break;
                    }

                    userId = task.user.replace(/^"(.*)"$/, '$1'); // Remove surrounding quotes if present
                    // Validate the length of the string and make sure it's a valid ObjectId

                    if (!(userId.length === 24 && /^[0-9a-fA-F]{24}$/.test(userId))) {
                      _context3.next = 7;
                      break;
                    }

                    task.user = new mongoose.Types.ObjectId(userId); // Convert to ObjectId using 'new'

                    _context3.next = 9;
                    break;

                  case 7:
                    console.error("Invalid ObjectId format:", userId);
                    return _context3.abrupt("return", res.status(400).send("Invalid ObjectId format."));

                  case 9:
                    // Log the userId to verify
                    console.log("User ID:", task.user); // Insert task into the database

                    return _context3.abrupt("return", Task.create(task));

                  case 11:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          })));

        case 21:
          _context4.next = 23;
          return regeneratorRuntime.awrap(fs.promises.unlink(file.path));

        case 23:
          // Send success response
          res.status(200).send("Tasks imported successfully");
          _context4.next = 30;
          break;

        case 26:
          _context4.prev = 26;
          _context4.t1 = _context4["catch"](0);
          console.error("Error during file upload or processing:", _context4.t1);
          res.status(500).send("Error importing tasks");

        case 30:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 26], [11, 15]]);
};