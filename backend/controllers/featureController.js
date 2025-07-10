const Feature = require('../models/featureModel');
const Project = require('../models/projectModel');
const cloudinary = require('../config/cloudinary');

// @desc    Get all features (public)
// @route   GET /api/features
// @access  Public
const getFeatures = async (req, res) => {
  try {
    const features = await Feature.find({}).sort({ order: 1 });
    res.json(features);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create feature (admin only)
// @route   POST /api/admin/features
// @access  Private
const createFeature = async (req, res) => {
  try {
    const { title, description, projectId } = req.body;
    
    let imageUrl = '';
    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio/features' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    // Get the highest order for this project to set the new feature's order
    const maxOrderFeature = await Feature.findOne({ project: projectId }).sort({ order: -1 });
    const newOrder = maxOrderFeature ? maxOrderFeature.order + 1 : 0;

    const feature = new Feature({
      title,
      description,
      imageUrl,
      project: projectId || null, // Set project reference
      order: newOrder,
    });

    const createdFeature = await feature.save();

    // Add feature to project
    if (projectId) {
      const project = await Project.findById(projectId);
      if (project) {
        project.features.push(createdFeature._id);
        await project.save();
      }
    }

    res.status(201).json(createdFeature);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update feature (admin only)
// @route   PUT /api/admin/features/:id
// @access  Private
const updateFeature = async (req, res) => {
  try {
    const { title, description, projectId } = req.body;
    
    const feature = await Feature.findById(req.params.id);
    if (!feature) {
      return res.status(404).json({ message: 'Feature not found' });
    }

    let imageUrl = feature.imageUrl;
    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio/features' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    // If projectId is changed, update project references
    if (projectId && (!feature.project || feature.project.toString() !== projectId)) {
      // Remove from old project
      if (feature.project) {
        await Project.findByIdAndUpdate(feature.project, { $pull: { features: feature._id } });
      }
      // Add to new project
      await Project.findByIdAndUpdate(projectId, { $addToSet: { features: feature._id } });
      feature.project = projectId;
    }

    feature.title = title || feature.title;
    feature.description = description || feature.description;
    feature.imageUrl = imageUrl;

    const updatedFeature = await feature.save();
    res.json(updatedFeature);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete feature (admin only)
// @route   DELETE /api/admin/features/:id
// @access  Private
const deleteFeature = async (req, res) => {
  try {
    const feature = await Feature.findById(req.params.id);
    if (!feature) {
      return res.status(404).json({ message: 'Feature not found' });
    }

    // Remove feature from all projects
    await Project.updateMany(
      { features: feature._id },
      { $pull: { features: feature._id } }
    );

    // Delete the feature using findByIdAndDelete instead of remove()
    await Feature.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feature removed' });
  } catch (error) {
    console.error('Delete feature error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update feature order (admin only)
// @route   PUT /api/features/order/update
// @access  Private
const updateFeatureOrder = async (req, res) => {
  try {
    const { featureOrders } = req.body; // Array of { featureId, order }
    
    if (!Array.isArray(featureOrders)) {
      return res.status(400).json({ message: 'Invalid feature orders data' });
    }

    // Update each feature's order
    const updatePromises = featureOrders.map(({ featureId, order }) => 
      Feature.findByIdAndUpdate(featureId, { order }, { new: true })
    );

    await Promise.all(updatePromises);
    
    res.json({ message: 'Feature order updated successfully' });
  } catch (error) {
    console.error('Update feature order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle key feature status (admin only)
// @route   PUT /api/features/:id/toggle-key
// @access  Private
const toggleKeyFeature = async (req, res) => {
  try {
    const feature = await Feature.findById(req.params.id);
    if (!feature) {
      return res.status(404).json({ message: 'Feature not found' });
    }

    // Toggle the isKeyFeature status
    feature.isKeyFeature = !feature.isKeyFeature;
    await feature.save();

    res.json({ 
      message: 'Key feature status updated successfully',
      isKeyFeature: feature.isKeyFeature 
    });
  } catch (error) {
    console.error('Toggle key feature error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
  updateFeatureOrder,
  toggleKeyFeature,
}; 