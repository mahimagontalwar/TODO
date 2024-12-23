const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const orderRoutes = require('./routes/orderRoutes');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks.js');
const instituteRoutes = require('./routes/instituteRoutes');
// Middleware
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // Frontend origin
  methods: ['GET', 'POST'],
}));
//const tasksAndProjectsRoutes = require('./routes/tasksAndProjects');
app.use(express.json());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api', instituteRoutes);
app.use('/api', projectRoutes);
app.use('/api/orders', orderRoutes);
// Error Haappndling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('Database connection failed:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
