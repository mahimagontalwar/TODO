const express = require('express');
const Task = require('../models/task');
const authenticate = require('../middlewares/auth');
const { body, validationResult } = require('express-validator');
const { validateTask } = require('../validators/taskValidators');
const router = express.Router();

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

// Get All Tasks
router.get('/', authenticate, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
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
        const task = await Task.findById(req.params.id);
        if (!task || task.user.toString() !== req.user._id)
            return res.status(404).json({ message: 'Task not found' });

       // await task.remove();
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;