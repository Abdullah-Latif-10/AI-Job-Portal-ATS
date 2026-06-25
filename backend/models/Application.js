const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidateName: {
    type: String,
    required: true
  },
  candidateEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Reviewed', 'Shortlisted', 'Hired', 'Rejected'],
    default: 'Applied'
  },
  matchScore: {
    type: Number,
    default: 75
  }
}, { timestamps: true });

ApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
ApplicationSchema.index({ candidateId: 1 });
ApplicationSchema.index({ jobId: 1 });

module.exports = mongoose.model('Application', ApplicationSchema);
