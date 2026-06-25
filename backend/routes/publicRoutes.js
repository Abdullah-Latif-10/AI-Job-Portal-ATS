const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/jobs', publicController.getJobs);
router.get('/jobs/:id', publicController.getJobDetail);

module.exports = router;
