const mongoose = require('mongoose');

const CompanyProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  // Cloudinary storage object structure for logos (Sprint 4/Sprint 8 requirements)
  logo: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' } // Needed to delete/replace assets on Cloudinary
  },
  // Links to the Recruiter account managing this profile
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('CompanyProfile', CompanyProfileSchema);    