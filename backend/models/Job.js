const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  companyLogo: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time'
  },
  remote: {
    type: Boolean,
    default: false
  },
  salary: {
    type: String,
    default: ''
  },
  salaryMin: {
    type: Number,
    default: null
  },
  salaryMax: {
    type: Number,
    default: null
  },
  postedDays: {
    type: Number,
    default: 0
  },
  skills: [{
    type: String
  }],
  description: {
    type: String,
    default: ''
  },
  responsibilities: [{
    type: String
  }],
  requirements: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

JobSchema.index({ postedBy: 1 });
JobSchema.index({ status: 1 });
JobSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Job', JobSchema);
