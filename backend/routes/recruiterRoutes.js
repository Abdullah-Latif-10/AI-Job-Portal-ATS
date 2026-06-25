const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const logoUpload = require('../middleware/logoUpload');
const recruiterController = require('../controllers/recruiterController');

// All recruiter routes require authentication and Recruiter role
router.use(authMiddleware);
router.use(authorizeRoles('Recruiter'));

// Dashboard Stats
router.get('/dashboard-stats', recruiterController.getDashboardStats);

// Jobs Management
router.get('/jobs', recruiterController.getJobs);
router.post('/jobs', recruiterController.postJob);
router.put('/jobs/:id', recruiterController.updateJob);
router.delete('/jobs/:id', recruiterController.deleteJob);

// Applicants Management
router.get('/applicants', recruiterController.getApplicants);
router.put('/applicants/:id/status', recruiterController.updateApplicantStatus);

// Interviews Management
router.get('/interviews', recruiterController.getInterviews);
router.post('/interviews/schedule', recruiterController.scheduleInterview);
router.put('/interviews/:id', recruiterController.updateInterview);
router.delete('/interviews/:id', recruiterController.deleteInterview);

// Company Profile Management
router.get('/company', recruiterController.getCompanyProfile);
router.put('/company', recruiterController.updateCompanyProfile);
router.post('/company/logo', logoUpload.single('logo'), recruiterController.uploadCompanyLogo);

module.exports = router;
