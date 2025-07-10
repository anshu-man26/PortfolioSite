const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }, // Add project reference
  order: { type: Number, default: 0 }, // Add order field for sorting
  isKeyFeature: { type: Boolean, default: false }, // Add field to mark key features
});

module.exports = mongoose.model('Feature', featureSchema); 