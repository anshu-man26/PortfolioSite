const Project = require('../models/projectModel');
const Feature = require('../models/featureModel');
const cloudinary = require('../config/cloudinary');

// @desc    Get all projects (public)
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).populate('features');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single project (public)
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('features');
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create project (admin only)
// @route   POST /api/admin/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { title, description, techStack, github, live } = req.body;
    
    let mainImage = '';
    if (req.file) {
      mainImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio/projects' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const project = new Project({
      title,
      description,
      techStack: techStack ? techStack.split(',') : [],
      github,
      live,
      mainImage,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update project (admin only)
// @route   PUT /api/admin/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const { title, description, techStack, github, live } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    let mainImage = project.mainImage;
    if (req.file) {
      mainImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio/projects' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.techStack = techStack ? techStack.split(',') : project.techStack;
    project.github = github || project.github;
    project.live = live || project.live;
    project.mainImage = mainImage;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete project (admin only)
// @route   DELETE /api/admin/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete associated features if any
    const featuresToDelete = Array.isArray(project.features) ? project.features : [];
    if (featuresToDelete.length > 0) {
      await Feature.deleteMany({ _id: { $in: featuresToDelete } });
    }
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    console.error('Error deleting project:', error); // Log the real error
    res.status(500).json({ message: error.message || 'Server error' }); // Return the real error
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
}; 