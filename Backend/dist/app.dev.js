"use strict";

var express = require('express');

var app = express();

var mongoose = require('mongoose');

require('dotenv').config();

var orderRoutes = require('./routes/orderRoutes');

var projectRoutes = require('./routes/projectRoutes');

var authRoutes = require('./routes/auth');

var taskRoutes = require('./routes/tasks.js');

var instituteRoutes = require('./routes/instituteRoutes'); // Middleware


var cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  // Frontend origin
  methods: ['GET', 'POST']
})); //const tasksAndProjectsRoutes = require('./routes/tasksAndProjects');

app.use(express.json()); // Routes

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api', instituteRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/orders', orderRoutes); // Error Haappndling Middleware

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error'
  });
}); // Connect to MongoDB

mongoose.connect(process.env.MONGO_URI).then(function () {
  return console.log('MongoDB connected');
})["catch"](function (err) {
  return console.error('Database connection failed:', err);
}); // Start Server

var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  return console.log("Server running on port ".concat(PORT));
});