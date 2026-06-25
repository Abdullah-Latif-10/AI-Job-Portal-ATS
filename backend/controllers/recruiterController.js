const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const CompanyProfile = require('../models/CompanyProfile');
const CandidateProfile = require('../models/CandidateProfile');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/cloudinary');
const {
  sendInterviewScheduledEmail,
  sendApplicationStatusUpdateEmail,
  sendInterviewCancelledEmail
} = require('../utils/email');
const { calculateMatchScore, notifyCandidatesForNewJob } = require('../utils/matchScore');
const { emitToUser } = require('../utils/socket');

const parseArrayField = (value, splitBy = ',') => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (splitBy === '\n') return value.split('\n').map((s) => s.trim()).filter(Boolean);
  return value.split(splitBy).map((s) => s.trim()).filter(Boolean);
};

// 1. Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const postedBy = req.user.userId;

    const jobs = await Job.find({ postedBy });
    const jobIds = jobs.map((job) => job._id);

    const openJobsCount = jobs.filter((job) => job.status === 'Open').length;

    const newApplicantsCount = await Application.countDocuments({
      jobId: { $in: jobIds },
      status: 'Applied'
    });

    const upcomingInterviewsCount = await Interview.countDocuments({
      recruiterId: req.user.userId
    });

    const totalAppsCount = await Application.countDocuments({ jobId: { $in: jobIds } });
    const hiredAppsCount = await Application.countDocuments({
      jobId: { $in: jobIds },
      status: 'Hired'
    });
    const hireRate = totalAppsCount > 0 ? Math.round((hiredAppsCount / totalAppsCount) * 100) : 15;

    const recentApplicants = await Application.find({ jobId: { $in: jobIds } })
      .populate('jobId')
      .sort({ createdAt: -1 })
      .limit(5);

    const upcomingInterviews = await Interview.find({ recruiterId: req.user.userId })
      .sort({ date: 1, time: 1 })
      .limit(3);

    return res.status(200).json({
      stats: {
        openJobsCount,
        newApplicantsCount,
        upcomingInterviewsCount,
        hireRate: `${hireRate}%`
      },
      recentApplicants,
      upcomingInterviews
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching recruiter dashboard stats', error: error.message });
  }
};

// 2. Get Jobs posted by recruiter
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.userId }).sort({ createdAt: -1 });

    const jobsWithCount = await Promise.all(
      jobs.map(async (job) => {
        const applicantsCount = await Application.countDocuments({ jobId: job._id });
        return {
          ...job.toObject(),
          applicants: applicantsCount
        };
      })
    );

    return res.status(200).json(jobsWithCount);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving recruiter jobs', error: error.message });
  }
};

// 3. Post a Job
exports.postJob = async (req, res) => {
  try {
    const { title, location, salary, salaryMin, salaryMax, type, status, description, skills, responsibilities, requirements, remote } = req.body;

    if (!title || !location) {
      return res.status(400).json({ message: 'Job title and location are required' });
    }

    const user = await User.findById(req.user.userId).populate('companyId');
    let companyName = '';
    let companyLogo = '';

    if (user?.companyId) {
      companyName = user.companyId.name || '';
      companyLogo = user.companyId.logo?.url || '';
    }

    if (!companyName.trim()) {
      return res.status(400).json({
        message: 'Please add your company name on the Company Profile page before posting a job.'
      });
    }

    if (user.companyId.status && user.companyId.status !== 'Approved') {
      return res.status(403).json({
        message: 'Your company profile must be approved by an administrator before posting jobs.'
      });
    }

    const job = await Job.create({
      title,
      company: companyName,
      companyLogo,
      location,
      type: type || 'Full-time',
      remote: !!remote,
      salary: salary || '',
      salaryMin: salaryMin !== undefined && salaryMin !== '' ? Number(salaryMin) : null,
      salaryMax: salaryMax !== undefined && salaryMax !== '' ? Number(salaryMax) : null,
      status: status || 'Open',
      description: description || '',
      skills: parseArrayField(skills),
      responsibilities: parseArrayField(responsibilities, '\n'),
      requirements: parseArrayField(requirements, '\n'),
      postedBy: req.user.userId
    });

    notifyCandidatesForNewJob(job).catch((err) =>
      console.error('Error sending job match notifications:', err.message)
    );

    return res.status(201).json(job);
  } catch (error) {
    return res.status(500).json({ message: 'Error posting job', error: error.message });
  }
};

// 4. Update a Job
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, location, salary, salaryMin, salaryMax, type, status, description, skills, responsibilities, requirements, remote } = req.body;

    const job = await Job.findOne({ _id: id, postedBy: req.user.userId });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (title !== undefined) job.title = title;
    if (location !== undefined) job.location = location;
    if (salary !== undefined) job.salary = salary;
    if (salaryMin !== undefined) job.salaryMin = salaryMin !== '' && salaryMin !== null ? Number(salaryMin) : null;
    if (salaryMax !== undefined) job.salaryMax = salaryMax !== '' && salaryMax !== null ? Number(salaryMax) : null;
    if (type !== undefined) job.type = type;
    if (status !== undefined) job.status = status;
    if (description !== undefined) job.description = description;
    if (remote !== undefined) job.remote = !!remote;
    if (skills !== undefined) job.skills = parseArrayField(skills);
    if (responsibilities !== undefined) job.responsibilities = parseArrayField(responsibilities, '\n');
    if (requirements !== undefined) job.requirements = parseArrayField(requirements, '\n');

    await job.save();
    return res.status(200).json(job);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating job', error: error.message });
  }
};

// 5. Delete a Job
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findOne({ _id: id, postedBy: req.user.userId });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await Application.deleteMany({ jobId: job._id });
    await Interview.deleteMany({ jobId: job._id });
    await Job.findByIdAndDelete(job._id);

    return res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
};

// 6. Get Applicants for jobs posted by recruiter
exports.getApplicants = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.userId });
    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('jobId')
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(
      applications.map(async (app) => {
        const profile = await CandidateProfile.findOne({ userId: app.candidateId });
        const jobSkills = app.jobId?.skills || [];
        const candidateSkills = profile?.skills || [];
        const matchScore = calculateMatchScore(candidateSkills, jobSkills);

        return {
          ...app.toObject(),
          matchScore,
          candidateProfile: profile
            ? {
                phone: profile.phone,
                location: profile.location,
                headline: profile.headline,
                summary: profile.summary,
                skills: profile.skills,
                experience: profile.experience,
                education: profile.education,
                resume: profile.resume
              }
            : null
        };
      })
    );

    return res.status(200).json(enriched);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving applicants', error: error.message });
  }
};

const VALID_STATUSES = ['Applied', 'Reviewed', 'Shortlisted', 'Hired', 'Rejected'];

// 7. Update Applicant Status
exports.updateApplicantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = await Job.findOne({ _id: application.jobId, postedBy: req.user.userId });
    if (!job) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    const companyName = job.company || 'Company';
    sendApplicationStatusUpdateEmail(
      application.candidateEmail,
      application.candidateName,
      job.title,
      companyName,
      status
    ).catch((err) => console.error('Error sending status update email:', err.message));

    emitToUser(application.candidateId.toString(), 'application:status', {
      applicationId: application._id,
      jobTitle: job.title,
      status
    });

    return res.status(200).json(application);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating applicant status', error: error.message });
  }
};

// 8. Get Interviews scheduled by recruiter
exports.getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ recruiterId: req.user.userId }).sort({ date: 1, time: 1 });
    return res.status(200).json(interviews);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving interviews', error: error.message });
  }
};

// 9. Schedule an Interview
exports.scheduleInterview = async (req, res) => {
  try {
    const { candidateId, jobId, date, time, mode, notes } = req.body;

    if (!candidateId || !jobId || !date || !time) {
      return res.status(400).json({ message: 'Candidate, Job, Date, and Time are required' });
    }

    const candidate = await User.findById(candidateId);
    const job = await Job.findOne({ _id: jobId, postedBy: req.user.userId });

    if (!candidate || !job) {
      return res.status(404).json({ message: 'Candidate or Job not found' });
    }

    const interview = await Interview.create({
      candidateId,
      candidateName: `${candidate.firstName} ${candidate.lastName}`,
      recruiterId: req.user.userId,
      jobId,
      jobTitle: job.title,
      company: job.company,
      date,
      time,
      mode: mode || 'Video',
      notes: notes || ''
    });

    await Application.findOneAndUpdate(
      { candidateId, jobId },
      { status: 'Shortlisted' },
      { new: true }
    );

    sendInterviewScheduledEmail(
      candidate.email,
      `${candidate.firstName} ${candidate.lastName}`,
      job.title,
      job.company,
      date,
      time,
      mode || 'Video',
      notes || ''
    ).catch((err) => console.error('Error sending interview email:', err.message));

    emitToUser(candidateId.toString(), 'interview:scheduled', {
      interviewId: interview._id,
      jobTitle: job.title,
      company: job.company,
      date,
      time,
      mode: mode || 'Video'
    });

    return res.status(201).json(interview);
  } catch (error) {
    return res.status(500).json({ message: 'Error scheduling interview', error: error.message });
  }
};

// 10. Update an Interview
exports.updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, mode, notes } = req.body;

    const interview = await Interview.findOne({ _id: id, recruiterId: req.user.userId });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (date !== undefined) interview.date = date;
    if (time !== undefined) interview.time = time;
    if (mode !== undefined) interview.mode = mode;
    if (notes !== undefined) interview.notes = notes;

    await interview.save();

    const candidate = await User.findById(interview.candidateId);
    if (candidate?.email) {
      sendInterviewScheduledEmail(
        candidate.email,
        interview.candidateName,
        interview.jobTitle,
        interview.company,
        interview.date,
        interview.time,
        interview.mode,
        interview.notes
      ).catch((err) => console.error('Error sending interview update email:', err.message));
    }

    return res.status(200).json(interview);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating interview', error: error.message });
  }
};

// 11. Delete an Interview
exports.deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findOneAndDelete({ _id: id, recruiterId: req.user.userId });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const candidate = await User.findById(interview.candidateId);
    if (candidate?.email) {
      sendInterviewCancelledEmail(
        candidate.email,
        interview.candidateName,
        interview.jobTitle,
        interview.company,
        interview.date,
        interview.time
      ).catch((err) => console.error('Error sending interview cancellation email:', err.message));
    }

    emitToUser(interview.candidateId.toString(), 'interview:cancelled', {
      interviewId: interview._id,
      jobTitle: interview.jobTitle,
      company: interview.company,
      date: interview.date,
      time: interview.time
    });

    return res.status(200).json({ message: 'Interview cancelled successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting interview', error: error.message });
  }
};

// 12. Get Recruiter's Company Profile
exports.getCompanyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    let profile = null;

    if (user.companyId) {
      profile = await CompanyProfile.findById(user.companyId);
    } else {
      profile = await CompanyProfile.findOne({ recruiterId: req.user.userId });
    }

    if (!profile) {
      profile = await CompanyProfile.create({
        name: '',
        description: '',
        website: '',
        logo: { url: '', publicId: '' },
        recruiterId: req.user.userId,
        industry: '',
        size: '',
        status: 'Pending'
      });
      user.companyId = profile._id;
      await user.save();
    }

    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving company profile', error: error.message });
  }
};

// 11. Update Recruiter's Company Profile
exports.updateCompanyProfile = async (req, res) => {
  try {
    const { name, description, website, industry, size } = req.body;
    const user = await User.findById(req.user.userId);
    let profile = null;

    if (user.companyId) {
      profile = await CompanyProfile.findById(user.companyId);
    } else {
      profile = await CompanyProfile.findOne({ recruiterId: req.user.userId });
    }

    if (!profile) {
      profile = new CompanyProfile({ recruiterId: req.user.userId, name: '' });
    }

    if (name !== undefined) profile.name = name;
    if (description !== undefined) profile.description = description;
    if (website !== undefined) profile.website = website;
    if (industry !== undefined) profile.industry = industry;
    if (size !== undefined) profile.size = size;

    await profile.save();

    if (user && !user.companyId) {
      user.companyId = profile._id;
      await user.save();
    }

    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating company profile', error: error.message });
  }
};

// 12. Upload Company Logo
exports.uploadCompanyLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No logo file provided' });
    }

    const user = await User.findById(req.user.userId);
    let profile = null;

    if (user.companyId) {
      profile = await CompanyProfile.findById(user.companyId);
    } else {
      profile = await CompanyProfile.findOne({ recruiterId: req.user.userId });
    }

    if (!profile) {
      profile = new CompanyProfile({ recruiterId: req.user.userId, name: '' });
    }

    const uploadResult = await uploadImageToCloudinary(req.file, 'logos');
    profile.logo = {
      url: uploadResult.url,
      publicId: uploadResult.publicId
    };

    await profile.save();

    if (user && !user.companyId) {
      user.companyId = profile._id;
      await user.save();
    }

    await Job.updateMany(
      { postedBy: req.user.userId },
      { companyLogo: uploadResult.url, company: profile.name }
    );

    return res.status(200).json({
      message: 'Company logo uploaded successfully',
      profile
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error uploading company logo', error: error.message });
  }
};
