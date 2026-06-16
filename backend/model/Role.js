const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Candidate', 'Recruiter', 'Admin'] // Updated to match your exact charter roles
  },
  permissions: [{
    type: String, // e.g., ['apply:jobs', 'post:jobs', 'view:analytics']
    required: true
  }]
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema);