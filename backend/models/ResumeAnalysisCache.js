const mongoose = require('mongoose');

const ResumeAnalysisCacheSchema = new mongoose.Schema({
  fileHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  result: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ResumeAnalysisCache', ResumeAnalysisCacheSchema);
