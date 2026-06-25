const User = require('../models/User');
const CompanyProfile = require('../models/CompanyProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');

// 1. Get Admin Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeCompanies = await CompanyProfile.countDocuments({ status: 'Approved' });
    const activeJobs = await Job.countDocuments({ status: 'Open' });

    // Placement Rate calculation
    const totalApps = await Application.countDocuments();
    const hiredApps = await Application.countDocuments({ status: 'Hired' });
    const placementRate = totalApps > 0 ? Math.round((hiredApps / totalApps) * 100) : 15; // default 15% fallback

    // Real signups aggregation — last 6 months cumulative
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlySignups = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const signupsMap = {};
    monthlySignups.forEach((row) => {
      const key = `${row._id.year}-${row._id.month}`;
      signupsMap[key] = row.count;
    });

    const signups = [];
    let cumulative = await User.countDocuments({ createdAt: { $lt: sixMonthsAgo } });
    for (let i = 0; i < 6; i++) {
      const d = new Date(sixMonthsAgo);
      d.setMonth(sixMonthsAgo.getMonth() + i);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      cumulative += signupsMap[key] || 0;
      signups.push({ m: monthNames[d.getMonth()], users: cumulative });
    }

    // Trending skills from open job postings
    const trendingSkillsAgg = await Job.aggregate([
      { $match: { status: 'Open' } },
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    const trendingSkills = trendingSkillsAgg.map((s) => ({ skill: s._id, count: s.count }));

    // Aggregated Jobs by Type
    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
    const jobsByType = await Promise.all(jobTypes.map(async (type) => {
      const count = await Job.countDocuments({ type });
      return { type, count };
    }));

    // Aggregated Application Statuses
    const statuses = ['Applied', 'Reviewed', 'Shortlisted', 'Hired', 'Rejected'];
    const appStatuses = await Promise.all(statuses.map(async (name) => {
      const value = await Application.countDocuments({ status: name });
      return { name, value };
    }));

    return res.status(200).json({
      stats: {
        totalUsers,
        activeCompanies,
        activeJobs,
        placementRate: `${placementRate}%`
      },
      signups,
      jobsByType,
      appStatuses,
      trendingSkills
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching admin stats', error: error.message });
  }
};

// 2. Get all Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate('roleId', 'name')
      .sort({ createdAt: -1 });

    const sanitizedUsers = users.map(user => {
      const plain = user.toObject();
      delete plain.password;
      return {
        ...plain,
        role: plain.roleId?.name || 'Candidate',
        name: `${plain.firstName} ${plain.lastName}`,
        joined: plain.createdAt ? new Date(plain.createdAt).toLocaleDateString() : 'Unknown',
        status: plain.isActive ? 'Active' : 'Suspended'
      };
    });

    return res.status(200).json(sanitizedUsers);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
};

// 3. Toggle User Status (isActive: true/false)
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      message: user.isActive ? 'User reactivated successfully' : 'User suspended successfully',
      user: {
        _id: user._id,
        isActive: user.isActive,
        status: user.isActive ? 'Active' : 'Suspended'
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error toggling user status', error: error.message });
  }
};

// 4. Get All Companies
exports.getCompanies = async (req, res) => {
  try {
    const companies = await CompanyProfile.find().sort({ createdAt: -1 });

    const companiesWithJobs = await Promise.all(companies.map(async (company) => {
      const jobsCount = await Job.countDocuments({ company: company.name });
      return {
        ...company.toObject(),
        jobs: jobsCount
      };
    }));

    return res.status(200).json(companiesWithJobs);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving companies', error: error.message });
  }
};

// 5. Update Company Approval Status (Approved, Pending, Rejected)
exports.updateCompanyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Pending', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid company approval status' });
    }

    const company = await CompanyProfile.findById(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    company.status = status;
    await company.save();

    return res.status(200).json(company);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating company status', error: error.message });
  }
};
