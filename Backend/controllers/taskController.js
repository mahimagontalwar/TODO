// In tasksController.js
const Task = require("../models/task"); // Your Task model
const fs = require("fs");
const mongoose = require('mongoose');
const multer = require("multer");
// Import the PDFKit library
const PDFDocument = require("pdfkit");
const XLSX = require("xlsx");
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});
exports.getTasksWithProjects = async (req, res) => {
  try {
    // Log the user ID from the request to check it's correct
    console.log('User ID from request:', req.user._id);

    // Aggregate query to match tasks by user ID
    const tasks = await Task.aggregate([
      {
        $match: { user:new mongoose.Types.ObjectId(req.user._id) } // Ensure the ID is in ObjectId format
      },
      {
        $lookup: {
          from: 'projects', // Ensure the collection name is 'projects'
          localField: 'project', // The field in Task referencing Project
          foreignField: '_id', // Reference field in the Project collection
          as: 'projectDetails'
        }
      },
      {
        $unwind: {
          path: '$projectDetails', // Unwind the array of project details
          preserveNullAndEmptyArrays: true // Allow tasks without projects
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          status: 1,
          'projectDetails.name': 1,
          'projectDetails.description': 1,
          'projectDetails.startDate': 1,
          'projectDetails.endDate': 1
        }
      }
    ]);

    // Log the tasks retrieved to help with debugging
    console.log('Tasks found:', tasks);

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No tasks found for the user.'
      });
    }

    return res.status(200).json({
      success: true,
      tasks: tasks
    });
  } catch (error) {
    console.error('Error in getTasksWithProjects:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};
// Import the xlsx library
exports.exportTasks = async (req, res) => {
  try {
    // Fetch data from the database
    const data = await Task.find({ user: req.user._id }, { _id: 0 });
    console.log('Fetched Data:', data);

    if (!data || data.length === 0) {
      return res.status(404).send("No data found");
    }

    // Transform data
    const transformedData = data.map((item) => ({
      title: item.title || "",
      description: item.description || "",
      status: item.status || "",
      user: item.user || ""
    }));
    console.log('Transformed Data:', transformedData);

    // Create workbook and worksheet
    const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks");

    // Define columns based on transformed data
    worksheet.columns = [
      { header: "title", key: "title", width: 30 },
      { header: "description", key: "description", width: 50 },
      { header: "status", key: "status", width: 20 },
      { header: "user", key: "user", width: 20 }
    ];
    console.log("Excel Columns:", worksheet.columns);

    // Add rows
    transformedData.forEach((row, index) => {
      console.log(`Adding Row ${index + 1}:`, row);
      worksheet.addRow(row);
    });

    // Set headers for Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", 'attachment; filename="tasks.xlsx"');

    // Write workbook to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Error exporting tasks:", err);
    if (!res.headersSent) {
      res.status(500).send("Error exporting tasks");
    }
  }
};



exports.exportTasksAsPDF = async (req, res) => {
  try {
    // Validate that req.user exists and has an _id property
    if (!req.user || !req.user._id) {
      console.error("Unauthorized: req.user is undefined or invalid");
      return res.status(401).send("Unauthorized: User not authenticated");
    }

    // Fetch tasks from the database
    const tasks = await Task.find({ user: req.user._id });

    if (!tasks || tasks.length === 0) {
      console.log("No tasks found for user:", req.user._id);
      return res.status(404).send("No tasks found for the authenticated user");
    }

    console.log("Fetched Tasks:", tasks);

    // Transform tasks data
    const transformedData = tasks.map((task) => ({
      title: task.title || "Untitled",
      description: task.description || "No Description",
      status: task.status || "No Status",
      user: task.user || "No User",
    }));

    console.log("Transformed Data:", transformedData);

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set the response headers for the PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="tasks.pdf"');

    // Pipe the document to the response
    doc.pipe(res);

    // Add Title
    doc.fontSize(20).text("Task List", { align: "center" });
    doc.moveDown();

    // Add tasks data to the PDF
    transformedData.forEach((task, index) => {
      doc
        .fontSize(12)
        .text(`${index + 1}. Title: ${task.title}`)
        .text(`   Description: ${task.description}`)
        .text(`   Status: ${task.status}`)
        .text(`   User ID: ${task.user}`)
        .moveDown();
    });

    // Finalize the PDF and end the response
    doc.end();
  } catch (err) {
    console.error("Error exporting tasks as PDF:", err);

    // Send a proper error response only if headers have not already been sent
    if (!res.headersSent) {
      res.status(500).send("Error exporting tasks as PDF");
    }
  }
};



// Controller function to import tasks
exports.importTasks = 
//   upload.single("file"), // Ensure 'file' matches the form field name
  async (req, res) => {
    try {
        // Check if the file is uploaded
        const file = req.file;
        if (!file) {
          console.log("No file uploaded");
          return res.status(400).send("No file uploaded");
        }
    
        // Log the file details
        console.log(`Received file: ${file.originalname}`);
    
        // Ensure the uploaded file is an Excel file (optional)
        if (!file.mimetype.includes("spreadsheet")) {
          return res.status(400).send("Invalid file type. Only Excel files are allowed.");
        }
    
        // Read the uploaded Excel file
        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0]; // Get the name of the first sheet
        const sheet = workbook.Sheets[sheetName];
    
        // Convert the sheet into a JSON array (each row becomes an object)
        let tasks;
        try {
          tasks = XLSX.utils.sheet_to_json(sheet);
        } catch (err) {
          console.error("Error parsing the Excel file:", err);
          return res.status(400).send("Error parsing the Excel file.");
        }
    
        // Process each task and insert it into the database (modify according to your schema)
        await Promise.all(
            tasks.map(async (task) => {
              console.log(task);
      
              // Sanitize and convert user field to ObjectId
              if (task.user) {
                let userId = task.user.replace(/^"(.*)"$/, '$1'); // Remove surrounding quotes if present
                
                // Validate the length of the string and make sure it's a valid ObjectId
                if (userId.length === 24 && /^[0-9a-fA-F]{24}$/.test(userId)) {
                  task.user = new mongoose.Types.ObjectId(userId); // Convert to ObjectId using 'new'
                } else {
                  console.error("Invalid ObjectId format:", userId);
                  return res.status(400).send("Invalid ObjectId format.");
                }
              }
      
              // Log the userId to verify
              console.log("User ID:", task.user);
      
              // Insert task into the database
              return Task.create(task);
            })
          ); // Inserting tasks concurrently
        // Clean up the uploaded file after processing
        await fs.promises.unlink(file.path);
    
        // Send success response
        res.status(200).send("Tasks imported successfully");
    
      } catch (err) {
        console.error("Error during file upload or processing:", err);
        res.status(500).send("Error importing tasks");
      }
    };
    

    exports.getTasksWithInstituteAggregation = async (req, res) => {
      try {
        const tasks = await Task.aggregate([
          // Match stage: Ensure we are getting tasks that have an associated institute
          { $match: { institute: { $ne: null } } },
          // Lookup stage: Join with the institutes collection based on the institute reference
          {
            $lookup: {
              from: 'institutes', // The name of the institute collection
              localField: 'institute', // The field in tasks that references institute
              foreignField: '_id', // The _id field in institutes collection
              as: 'instituteDetails', // The field where we want to store the results
            },
          },
          // Unwind stage: Flatten the instituteDetails array
          { $unwind: '$instituteDetails' },
          // Optional: Project the fields you want to return
          {
            $project: {
              _id: 1,
              name: 1,
              description: 1,
              dueDate: 1,
              'instituteDetails.name': 1,
              'instituteDetails.location': 1,
              'instituteDetails.type': 1,
            },
          },
        ]);
    
        if (tasks.length === 0) {
          return res.status(404).json({ success: false, message: 'No tasks found.' });
        }
    
        res.json({ success: true, data: tasks });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
      }
    };
    