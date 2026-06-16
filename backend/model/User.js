const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  // Password is only required for local email/password login
  password: {
    type: String,
    required: function() { return !this.googleId; } 
  },
  // Added for Sprint 1 Google OAuth support
  googleId: {
    type: String,
    default: null
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  // Populated when a Recruiter connects to a company, or Admin manages them
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true // Used by Admin in Sprint 7 to suspend/delete accounts
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);