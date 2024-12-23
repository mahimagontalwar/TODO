const Project = require('../models/project');
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate request
    if (!name || !description) {
      return res.status(400).json({ error: 'Both name and description are required.' });
    }
    const existingProject = await Project.findOne({ name: name });
    if (existingProject) {
        return res.status(400).json({ message: "project with this name already exists." });
      }
    // Create a new project
    const newProject = new Project({
      name,
      description // Optional: Initialize with provided tasks or an empty array
    });

    // Save the project to the database
     await newProject.save();

    res.status(201).json({
      message: 'Project created successfully',
      name: newProject.name,
      description: newProject.description,
      _id: newProject._id,
      __v: newProject.__v

    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProjectsWithTasksPopulate = async (req, res) => {
  try {
    const projects = await Project.find().populate('tasks', 'title description');
    
    res.json(projects);
  } catch (error) {
    
    res.status(500).json({ error: 'Error fetching projects with tasks (populate)' });
  }
};

const getProjectsWithTasksAggregation =async (req, res) => {
  try {
    const projects = await Project.aggregate([
      // Match stage to filter projects (optional)
      {
        $match: {}
      },
      // Lookup stage to join the tasks from the Task collection
      {
        $lookup: {
          from: 'tasks',   // The name of the tasks collection in MongoDB
          localField: 'tasks',   // Field in the Project collection containing ObjectIds of tasks
          foreignField: '_id',   // The _id field in the Task collection
          as: 'tasks'  // The alias for the joined tasks
        }
      },
      // Project stage to format the response (optional)
      {
        $project: {
          name: 1,  // Include the project name
          tasks: {
            $map: {
              input: '$tasks',
              as: 'task',
              in: {
                title: '$$task.title',
                description: '$$task.description'
              }
            }
          }
        }
      }
    ]);

    res.json(projects);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching projects with tasks (aggregation)' });
  }
};

module.exports = {createProject ,getProjectsWithTasksPopulate,getProjectsWithTasksAggregation  };
