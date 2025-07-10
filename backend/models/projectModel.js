const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [{ type: String }],
  features: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feature', default: [] }],
  mainImage: { type: String },
  github: { type: String },
  live: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', projectSchema); 