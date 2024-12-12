const express = require('express');
const Task = require('../models/task');
const authenticate = require('../middlewares/auth');
const { body, validationResult } = require('express-validator');
const { validateTask } = require('../validators/taskValidators');
const router = express.Router();
//const {  getTasksWithProjects } = require('../controllers/taskController');
const { exportTasks,importTasks } = require('../controllers/taskController');
const { exportTasksAsPDF } = require('../controllers/taskController');
const { getTasksWithProjects } = require('../controllers/taskController');

// Route to get tasks with project details
router.get('/tasks-with-project',authenticate,getTasksWithProjects);
// In tasks.js (routes file)
const multer = require('multer');
// Set up multer for file upload with a file size limit of 10MB
const upload = multer({
    dest: "uploads/", // Destination folder for temporary file storage
    limits: {
      fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
    },
  });
   router.get('/export',authenticate, exportTasks);
 router.get('/export/pdf',authenticate, exportTasksAsPDF);

 router.post('/import', upload.single('file'), importTasks);

// router.post('/import',upload.single('file'), importTasks);
// Define the import route
// // Export tasks as PDF



// Create Task
router.post(
    '/',
    authenticate,validateTask,
    body('title').notEmpty().withMessage('Title is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const task = new Task({ ...req.body, user: req.user._id });
            await task.save();
            res.status(201).json(task);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);



// Get All Tasks with Search and Filter
router.get('/', authenticate, async (req, res) => {
    try {
        // Initialize the filters object
        const filters = { user: req.user._id }; // Ensure it only returns the user's tasks

        // Dynamically add filters if query parameters are present
        if (req.query.title) {
            filters.title = { $regex: req.query.title, $options: 'i' }; // Case-insensitive search
        }

        if (req.query.status) {
            filters.status = req.query.status;
        }

        if (req.query.user) {
            filters.user = req.query.user;
        }

        // Find tasks using the filters
        const tasks = await Task.find(filters);
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Task
router.put('/:id', authenticate, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task || task.user.toString() !== req.user._id)
            return res.status(404).json({ message: 'Task not found' });

        Object.assign(task, req.body);
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Task
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task || task.user.toString() !== req.user._id)
            return res.status(404).json({ message: 'Task not found' });

       // await task.remove();
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;