const mongoose = require('mongoose');

const socialLinksSchema = new mongoose.Schema({
  github: String,
  linkedin: String,
  twitter: String,
  website: String,
  email: String,
  phone: String,
  showPhone: { type: Boolean, default: true }, // Control phone number visibility
});

const experienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  period: String,
  description: String,
});

const educationSchema = new mongoose.Schema({
  type: { type: String, enum: ['college', 'school'], required: true },
  // College/University fields
  institution: String,
  program: String,
  branch: String,
  startYear: String,
  endYear: String,
  description: String,
  collegePfp: String, // URL to college profile picture
  // School fields
  schoolName: String,
  board: String,
  class: String,
  yearOfPassing: String,
  marks: String,
  schoolPfp: String, // URL to school profile picture
});

const portfolioSchema = new mongoose.Schema({
  personalInfo: {
    name: String,
    title: String,
    email: String,
    location: String,
    about: String,
    pfp: String, // URL to user's own profile picture
    skills: [String],
    socialLinks: socialLinksSchema,
    resumeLink: String, // URL to resume file
  },
  aboutMe: String, // Separate About Me field for About section
  experience: [experienceSchema],
  education: [educationSchema],
});

module.exports = mongoose.model('Portfolio', portfolioSchema); 