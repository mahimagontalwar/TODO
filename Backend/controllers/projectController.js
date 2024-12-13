const Project = require('../models/project');
const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validate request
    if (!title || !description) {
      return res.status(400).json({ error: 'Both title and description are required.' });
    }
    const existingProject = await Project.findOne({ title: title });
    if (existingProject) {
        return res.status(400).json({ message: "project with this title already exists." });
      }
    // Create a new project
    const newProject = new Project({
      title,
      description // Optional: Initialize with provided tasks or an empty array
    });

    // Save the project to the database
     await newProject.save();

    res.status(201).json({
      message: 'Project created successfully',
      title: newProject.title,
      description: newProject.description,
      _id: newProject._id,
      __v: newProject.__v

    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {createProject };
