const CandidateProfile = require('../models/CandidateProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const User = require('../models/User');
const { uploadToCloudinary, sanitizeFilename } = require('../utils/cloudinary');
const { parseResumeWithGemini } = require('../utils/gemini');
const { getCachedOrParseResume } = require('../utils/resumeAnalysis');
const { calculateMatchScore, notifyCandidateOfMatchingJobs } = require('../utils/matchScore');
const { buildJobQuery, paginateJobs } = require('../utils/jobFilters');
const { sendApplicationReceivedEmail } = require('../utils/email');

// 1. Get Candidate Profile
exports.getProfile = async (req, res) => {
  try {
    let profile = await CandidateProfile.findOne({ userId: req.user.userId })
      .populate('userId', 'firstName lastName email');

    if (!profile) {
      // Create a default empty profile
      const user = await User.findById(req.user.userId);
      profile = await CandidateProfile.create({
        userId: req.user.userId,
        phone: '',
        location: '',
        headline: '',
        skills: [],
        summary: '',
        experience: [],
        education: []
      });
      profile = await profile.populate('userId', 'firstName lastName email');
    }

    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving profile', error: error.message });
  }
};

// 2. Update Candidate Profile
exports.updateProfile = async (req, res) => {
  try {
    const { phone, location, headline, skills, summary, experience, education } = req.body;

    let profile = await CandidateProfile.findOne({ userId: req.user.userId });

    if (!profile) {
      profile = new CandidateProfile({ userId: req.user.userId });
    }

    if (phone !== undefined) profile.phone = phone;
    if (location !== undefined) profile.location = location;
    if (headline !== undefined) profile.headline = headline;
    if (skills !== undefined) profile.skills = skills;
    if (summary !== undefined) profile.summary = summary;
    if (experience !== undefined) profile.experience = experience;
    if (education !== undefined) profile.education = education;

    await profile.save();
    profile = await profile.populate('userId', 'firstName lastName email');

    // Also update User first/last name if sent in body (optional personal info sync)
    if (req.body.firstName || req.body.lastName) {
      const user = await User.findById(req.user.userId);
      if (user) {
        if (req.body.firstName) user.firstName = req.body.firstName;
        if (req.body.lastName) user.lastName = req.body.lastName;
        await user.save();
        profile.userId.firstName = user.firstName;
        profile.userId.lastName = user.lastName;
      }
    }

    notifyCandidateOfMatchingJobs(profile, req.user.userId).catch((err) =>
      console.error('Error sending job match notifications:', err.message)
    );

    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// 3. Resume Upload and AI Skill Extraction
exports.uploadResume = async (req, res) => {
  try {
    let fileUrl = '';
    let fileName = '';
    let extractedData = null;

    if (req.file) {
      // Clean/sanitize filename
      const cleanName = sanitizeFilename(req.file.originalname);
      // Upload file to Cloudinary (or mock fallback if credentials missing)
      const uploadResult = await uploadToCloudinary(req.file, 'resumes');
      fileUrl = uploadResult.url;
      fileName = cleanName;

      // Extract details from resume using Gemini
      extractedData = await getCachedOrParseResume(req.file.buffer, req.file.mimetype);
    } else {
      // Backward compatibility fallback
      const { filename } = req.body;
      fileName = filename || 'resume.pdf';
      fileUrl = `https://hireloop-resumes.s3.amazonaws.com/${Date.now()}_${fileName}`;
    }

    let profile = await CandidateProfile.findOne({ userId: req.user.userId });
    if (!profile) {
      profile = new CandidateProfile({ userId: req.user.userId });
    }

    profile.resume = {
      url: fileUrl,
      filename: fileName
    };
    
    if (extractedData) {
      applyExtractedDataToProfile(profile, extractedData);
    } else {
      // Fallback: Simulate AI parsing by extracting mock skills and summary
      const mockSkills = ["React", "TypeScript", "Node.js", "GraphQL", "PostgreSQL", "Tailwind", "Figma", "Jest"];
      const mockSummary = "Full-stack engineer with 5 years of experience shipping consumer-facing web products. Strong React/TypeScript foundation, comfortable across the stack, and a track record of mentoring junior engineers.";

      const currentSkills = profile.skills || [];
      const mergedSkills = Array.from(new Set([...currentSkills, ...mockSkills]));
      profile.skills = mergedSkills;
      profile.summary = mockSummary;
      profile.experienceLevel = profile.experienceLevel || 'Mid';
      profile.lastAnalyzedAt = new Date();
    }

    await profile.save();
    profile = await profile.populate('userId', 'firstName lastName email');

    notifyCandidateOfMatchingJobs(profile, req.user.userId).catch((err) =>
      console.error('Error sending job match notifications:', err.message)
    );

    return res.status(200).json({
      message: extractedData 
        ? 'Resume uploaded and parsed successfully by Gemini AI' 
        : 'Resume uploaded and parsed successfully by Mock AI',
      profile
    });
  } catch (error) {
    return res.status(500).json({ message: 'Resume upload failed', error: error.message });
  }
};

const applyExtractedDataToProfile = (profile, extractedData) => {
  if (!extractedData) return false;

  if (extractedData.summary) profile.summary = extractedData.summary;
  if (extractedData.skills?.length) profile.skills = extractedData.skills;
  if (extractedData.experience?.length) {
    profile.experience = extractedData.experience.map((exp) => ({
      role: exp.role || 'Role N/A',
      company: exp.company || 'Company N/A',
      period: exp.period || 'Period N/A'
    }));
  }
  if (extractedData.education?.length) {
    profile.education = extractedData.education.map((edu) => ({
      degree: edu.degree || 'Degree N/A',
      school: edu.school || 'School N/A',
      period: edu.period || 'Period N/A'
    }));
  }
  if (extractedData.headline) profile.headline = extractedData.headline;
  if (extractedData.phone) profile.phone = extractedData.phone;
  if (extractedData.location) profile.location = extractedData.location;
  if (extractedData.experienceLevel) profile.experienceLevel = extractedData.experienceLevel;
  profile.lastAnalyzedAt = new Date();
  return true;
};

// 3b. Standalone resume analysis (skills, experience level, summary)
exports.analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    const extractedData = await getCachedOrParseResume(req.file.buffer, req.file.mimetype);

    let profile = await CandidateProfile.findOne({ userId: req.user.userId });
    if (!profile) {
      profile = new CandidateProfile({ userId: req.user.userId });
    }

    const fromAi = applyExtractedDataToProfile(profile, extractedData);
    if (!fromAi) {
      profile.experienceLevel = profile.experienceLevel || 'Mid';
      profile.lastAnalyzedAt = new Date();
    }

    await profile.save();
    profile = await profile.populate('userId', 'firstName lastName email');

    return res.status(200).json({
      message: extractedData ? 'Resume analyzed successfully' : 'Resume analyzed with fallback data',
      extractedData: extractedData || {
        summary: profile.summary,
        skills: profile.skills,
        experienceLevel: profile.experienceLevel
      },
      profile
    });
  } catch (error) {
    return res.status(500).json({ message: 'Resume analysis failed', error: error.message });
  }
};

// 4. Get Jobs with Filters & Pagination
exports.getJobs = async (req, res) => {
  try {
    const { q, type, remote, location, salaryMin, salaryMax, page = 1, limit = 4 } = req.query;
    const query = buildJobQuery({ q, type, remote, location, salaryMin, salaryMax });
    const result = await paginateJobs(Job, query, page, limit);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving jobs', error: error.message });
  }
};

// 5. Get Job Detail (including applied & saved indicators)
exports.getJobDetail = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check application status
    const applied = await Application.exists({
      jobId: job._id,
      candidateId: req.user.userId
    });

    // Check saved status
    const profile = await CandidateProfile.findOne({ userId: req.user.userId });
    const saved = profile && profile.savedJobs ? profile.savedJobs.includes(job._id) : false;

    // Calculate match score dynamically
    let matchScore = 75;
    if (profile && profile.skills && profile.skills.length > 0) {
      matchScore = calculateMatchScore(profile.skills, job.skills);
    }

    return res.status(200).json({
      job,
      applied: !!applied,
      saved: !!saved,
      matchScore
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving job details', error: error.message });
  }
};

// 6. Get Saved Jobs
exports.getSavedJobs = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({ userId: req.user.userId })
      .populate({
        path: 'savedJobs',
        match: { status: 'Open' }
      });

    const savedJobs = profile && profile.savedJobs ? profile.savedJobs : [];

    return res.status(200).json(savedJobs);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving saved jobs', error: error.message });
  }
};

// 7. Toggle Save Job
exports.toggleSaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    let profile = await CandidateProfile.findOne({ userId: req.user.userId });
    if (!profile) {
      profile = new CandidateProfile({ userId: req.user.userId, savedJobs: [] });
    }

    const index = profile.savedJobs.indexOf(jobId);
    let saved = false;

    if (index === -1) {
      profile.savedJobs.push(jobId);
      saved = true;
    } else {
      profile.savedJobs.splice(index, 1);
      saved = false;
    }

    await profile.save();

    return res.status(200).json({
      message: saved ? 'Job saved for later' : 'Job removed from saved',
      saved
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error toggling saved job', error: error.message });
  }
};

// 8. Get Candidate Applications
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user.userId })
      .populate('jobId')
      .sort({ createdAt: -1 });

    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving applications', error: error.message });
  }
};

// 9. Apply For Job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status === 'Closed') {
      return res.status(400).json({ message: 'This job is no longer accepting applications' });
    }

    const alreadyApplied = await Application.findOne({
      jobId,
      candidateId: req.user.userId
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const user = await User.findById(req.user.userId);
    const profile = await CandidateProfile.findOne({ userId: req.user.userId });

    // Calculate dynamic match score
    let matchScore = 75;
    if (profile && profile.skills && profile.skills.length > 0) {
      matchScore = calculateMatchScore(profile.skills, job.skills);
    }

    const application = await Application.create({
      jobId,
      candidateId: req.user.userId,
      candidateName: `${user.firstName} ${user.lastName}`,
      candidateEmail: user.email,
      status: 'Applied',
      matchScore
    });

    sendApplicationReceivedEmail(
      user.email,
      `${user.firstName} ${user.lastName}`,
      job.title,
      job.company,
      matchScore
    ).catch((err) => console.error('Error sending application received email:', err.message));

    return res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error applying for job', error: error.message });
  }
};

// 11. Get Candidate Interviews
exports.getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ candidateId: req.user.userId })
      .sort({ date: 1, time: 1 });
    return res.status(200).json(interviews);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving interviews', error: error.message });
  }
};

// 10. Dashboard Stats (applications count, shortlisted count, saved count, average match score)
exports.getDashboardStats = async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user.userId });
    const profile = await CandidateProfile.findOne({ userId: req.user.userId });
    
    const applicationsCount = applications.length;
    const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
    const savedCount = profile && profile.savedJobs ? profile.savedJobs.length : 0;
    
    let totalScore = 0;
    applications.forEach(a => {
      totalScore += (a.matchScore || 75);
    });
    const avgMatchScore = applicationsCount > 0 ? Math.round(totalScore / applicationsCount) : 0;

    // Fetch up to 4 recent applications populated with job details
    const recentApplications = await Application.find({ candidateId: req.user.userId })
      .populate('jobId')
      .sort({ createdAt: -1 })
      .limit(4);

    // Fetch recommended jobs (matching candidate profile skills, up to 3 jobs)
    let recommendedJobs = [];
    if (profile && profile.skills && profile.skills.length > 0) {
      // Find jobs that require at least one of candidate's skills
      recommendedJobs = await Job.find({
        status: 'Open',
        skills: { $in: profile.skills }
      }).limit(3);
    }

    // Fallback if no recommended jobs found based on skills, fetch latest open jobs
    if (recommendedJobs.length === 0) {
      recommendedJobs = await Job.find({ status: 'Open' }).sort({ createdAt: -1 }).limit(3);
    }

    const user = await User.findById(req.user.userId);

    return res.status(200).json({
      firstName: user ? user.firstName : "Candidate",
      stats: {
        applicationsCount,
        shortlistedCount,
        savedCount,
        avgMatchScore: `${avgMatchScore || 75}%`
      },
      recentApplications,
      recommendedJobs
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving dashboard stats', error: error.message });
  }
};
