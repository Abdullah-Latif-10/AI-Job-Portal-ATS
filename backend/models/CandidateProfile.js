const mongoose = require('mongoose');

const CandidateProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  headline: {
    type: String,
    default: ''
  },
  experience: [{
    role: { type: String, required: true },
    company: { type: String, required: true },
    period: { type: String, required: true }
  }],
  education: [{
    degree: { type: String, required: true },
    school: { type: String, required: true },
    period: { type: String, required: true }
  }],
  resume: {
    url: { type: String, default: '' },
    filename: { type: String, default: '' }
  },
  skills: [{
    type: String
  }],
  summary: {
    type: String,
    default: ''
  },
  experienceLevel: {
    type: String,
    enum: ['', 'Entry', 'Mid', 'Senior', 'Lead', 'Executive'],
    default: ''
  },
  lastAnalyzedAt: {
    type: Date,
    default: null
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }]
}, { timestamps: true });

module.exports = mongoose.model('CandidateProfile', CandidateProfileSchema);
