const Job = require('../models/Job');
const User = require('../models/User');
const { sendJobMatchEmail } = require('./email');

const calculateMatchScore = (candidateSkills, jobSkills) => {
  if (!jobSkills || jobSkills.length === 0) return 75;
  if (!candidateSkills || candidateSkills.length === 0) return 50;

  const candidateSkillsLower = candidateSkills.map((s) => s.toLowerCase());
  const overlaps = jobSkills.filter((s) => candidateSkillsLower.includes(s.toLowerCase()));

  const score = Math.round((overlaps.length / jobSkills.length) * 100);
  return Math.max(50, Math.min(100, score));
};

const notifyCandidateOfMatchingJobs = async (profile, userId) => {
  if (!profile?.skills?.length) return;

  const user = await User.findById(userId);
  if (!user?.email) return;

  const openJobs = await Job.find({ status: 'Open' });
  const candidateName = `${user.firstName} ${user.lastName}`;

  for (const job of openJobs) {
    const score = calculateMatchScore(profile.skills, job.skills);
    if (score > 75) {
      await sendJobMatchEmail(
        user.email,
        candidateName,
        job.title,
        job.company,
        score,
        job._id
      );
    }
  }
};

const notifyCandidatesForNewJob = async (job) => {
  const CandidateProfile = require('../models/CandidateProfile');
  const profiles = await CandidateProfile.find({ skills: { $exists: true, $ne: [] } }).populate(
    'userId',
    'firstName lastName email'
  );

  for (const profile of profiles) {
    const score = calculateMatchScore(profile.skills, job.skills);
    if (score > 75 && profile.userId?.email) {
      const candidateName = `${profile.userId.firstName} ${profile.userId.lastName}`;
      await sendJobMatchEmail(
        profile.userId.email,
        candidateName,
        job.title,
        job.company,
        score,
        job._id
      );
    }
  }
};

module.exports = {
  calculateMatchScore,
  notifyCandidateOfMatchingJobs,
  notifyCandidatesForNewJob
};
