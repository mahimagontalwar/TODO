const Project = require('../models/project');
const createProject = async (req, res) => {
    const { name, description, startDate, endDate } = req.body;
  
    // Validate that all required fields are provided
    if (!name || !description || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, startDate, and endDate.',
      });
    }
  
    try {
      // Create a new project with the provided data
      const newProject = new Project({
        name,
        description,
        startDate,
        endDate,
      });
  
      // Save the project to the database
      const savedProject = await newProject.save();
  
      // Return the saved project
      res.status(201).json({
        success: true,
        data: savedProject,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server error. Could not create project.',
      });
    }
  };
  

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    if (projects.length === 0) {
      return res.status(404).json({ success: false, message: 'No projects found.' });
    }
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createProject,getProjects };
