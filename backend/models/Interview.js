const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidateName: {
    type: String,
    required: true
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    enum: ['Video', 'On-site', 'Phone'],
    default: 'Video'
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

InterviewSchema.index({ recruiterId: 1 });
InterviewSchema.index({ candidateId: 1 });
InterviewSchema.index({ jobId: 1 });

module.exports = mongoose.model('Interview', InterviewSchema);
