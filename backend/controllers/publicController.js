const Job = require('../models/Job');
const mongoose = require('mongoose');
const { buildJobQuery, paginateJobs } = require('../utils/jobFilters');

exports.getJobs = async (req, res) => {
  try {
    const { q, type, remote, location, salaryMin, salaryMax, page = 1, limit = 8 } = req.query;
    const query = buildJobQuery({ q, type, remote, location, salaryMin, salaryMax });
    const result = await paginateJobs(Job, query, page, limit);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving jobs', error: error.message });
  }
};

exports.getJobDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const job = await Job.findOne({ _id: id, status: 'Open' });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    return res.status(200).json({ job });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving job details', error: error.message });
  }
};
