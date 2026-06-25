const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

// All admin routes require authentication and Admin role
router.use(authMiddleware);
router.use(authorizeRoles('Admin'));

// Dashboard Stats
router.get('/dashboard-stats', adminController.getDashboardStats);

// Users Management
router.get('/users', adminController.getUsers);
router.put('/users/:id/toggle-status', adminController.toggleUserStatus);

// Companies Management
router.get('/companies', adminController.getCompanies);
router.put('/companies/:id/status', adminController.updateCompanyStatus);

module.exports = router;
