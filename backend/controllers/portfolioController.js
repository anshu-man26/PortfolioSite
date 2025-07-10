const Portfolio = require('../models/portfolioModel');
const cloudinary = require('../config/cloudinary');

// Get portfolio info
exports.getPortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      // If not found, create default
      portfolio = await Portfolio.create({});
    }
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update portfolio info (admin only)
exports.updatePortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      portfolio = await Portfolio.create({});
    }
    // Update fields
    portfolio.personalInfo = req.body.personalInfo || portfolio.personalInfo;
    portfolio.aboutMe = req.body.aboutMe !== undefined ? req.body.aboutMe : portfolio.aboutMe;
    portfolio.experience = req.body.experience || portfolio.experience;
    portfolio.education = req.body.education || portfolio.education;
    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload college profile picture for an education entry
exports.uploadCollegePfp = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  const { educationIndex } = req.body;
  if (educationIndex === undefined) {
    return res.status(400).json({ message: 'Education index is required' });
  }
  
  const stream = cloudinary.uploader.upload_stream({
    folder: 'portfolio/collegePfp',
    resource_type: 'image',
  }, async (error, result) => {
    if (error) {
      return res.status(500).json({ message: 'Cloudinary upload error' });
    }
    
    try {
      // Update the portfolio with the new college PFP URL
      let portfolio = await Portfolio.findOne();
      if (!portfolio) {
        portfolio = await Portfolio.create({});
      }
      
      if (!portfolio.education[educationIndex]) {
        return res.status(400).json({ message: 'Education entry not found' });
      }
      
      portfolio.education[educationIndex].collegePfp = result.secure_url;
      await portfolio.save();
      
      return res.json({ url: result.secure_url });
    } catch (err) {
      return res.status(500).json({ message: 'Failed to save portfolio data' });
    }
  });
  
  require('streamifier').createReadStream(req.file.buffer).pipe(stream);
};

// Upload school profile picture for a school education entry
exports.uploadSchoolPfp = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  const { educationIndex } = req.body;
  if (educationIndex === undefined) {
    return res.status(400).json({ message: 'Education index is required' });
  }
  
  const stream = cloudinary.uploader.upload_stream({
    folder: 'portfolio/schoolPfp',
    resource_type: 'image',
  }, async (error, result) => {
    if (error) {
      return res.status(500).json({ message: 'Cloudinary upload error' });
    }
    
    try {
      // Update the portfolio with the new school PFP URL
      let portfolio = await Portfolio.findOne();
      if (!portfolio) {
        portfolio = await Portfolio.create({});
      }
      
      if (!portfolio.education[educationIndex]) {
        return res.status(400).json({ message: 'Education entry not found' });
      }
      
      portfolio.education[educationIndex].schoolPfp = result.secure_url;
      await portfolio.save();
      
      return res.json({ url: result.secure_url });
    } catch (err) {
      return res.status(500).json({ message: 'Failed to save portfolio data' });
    }
  });
  
  require('streamifier').createReadStream(req.file.buffer).pipe(stream);
};

// Upload personal profile picture
exports.uploadPersonalPfp = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  const stream = cloudinary.uploader.upload_stream({
    folder: 'portfolio/personalPfp',
    resource_type: 'image',
  }, async (error, result) => {
    if (error) {
      return res.status(500).json({ message: 'Cloudinary upload error' });
    }
    
    try {
      // Update the portfolio with the new personal PFP URL
      let portfolio = await Portfolio.findOne();
      if (!portfolio) {
        portfolio = await Portfolio.create({});
      }
      
      portfolio.personalInfo.pfp = result.secure_url;
      await portfolio.save();
      
      return res.json({ url: result.secure_url });
    } catch (err) {
      return res.status(500).json({ message: 'Failed to save portfolio data' });
    }
  });
  
  require('streamifier').createReadStream(req.file.buffer).pipe(stream);
}; 