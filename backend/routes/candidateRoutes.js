const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const candidateController = require('../controllers/candidateController');

const upload = require('../middleware/upload');

// All candidate routes require authentication and Candidate (or Admin) roles
router.use(authMiddleware);
router.use(authorizeRoles('Candidate'));

// Dashboard Stats
router.get('/dashboard-stats', candidateController.getDashboardStats);

// Profile
router.get('/profile', candidateController.getProfile);
router.put('/profile', candidateController.updateProfile);
router.post('/profile/resume', upload.single('resume'), candidateController.uploadResume);
router.post('/profile/resume/analyze', upload.single('resume'), candidateController.analyzeResume);

// Jobs
router.get('/jobs', candidateController.getJobs);
router.get('/jobs/:id', candidateController.getJobDetail);

// Saved Jobs
router.get('/saved', candidateController.getSavedJobs);
router.post('/saved/:jobId', candidateController.toggleSaveJob);

// Applications
router.get('/applications', candidateController.getApplications);
router.post('/apply/:jobId', candidateController.applyForJob);

// Interviews
router.get('/interviews', candidateController.getInterviews);

module.exports = router;