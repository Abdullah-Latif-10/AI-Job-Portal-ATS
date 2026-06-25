const buildJobQuery = (filters = {}) => {
  const { q, type, remote, location, salaryMin, salaryMax } = filters;
  const query = { status: 'Open' };

  if (q) {
    const searchRegex = new RegExp(q, 'i');
    query.$or = [
      { title: searchRegex },
      { company: searchRegex },
      { skills: searchRegex },
      { location: searchRegex }
    ];
  }

  if (type && type !== 'All') {
    query.type = type;
  }

  if (remote === 'true' || remote === true) {
    query.remote = true;
  }

  if (location) {
    query.location = new RegExp(location, 'i');
  }

  if (salaryMin !== undefined && salaryMin !== '' && !Number.isNaN(Number(salaryMin))) {
    query.salaryMax = { $gte: Number(salaryMin) };
  }

  if (salaryMax !== undefined && salaryMax !== '' && !Number.isNaN(Number(salaryMax))) {
    query.salaryMin = { ...(query.salaryMin || {}), $lte: Number(salaryMax) };
  }

  return query;
};

const paginateJobs = async (Job, query, page = 1, limit = 4) => {
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const totalCount = await Job.countDocuments(query);
  const jobs = await Job.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit, 10));

  return {
    jobs,
    totalPages: Math.ceil(totalCount / parseInt(limit, 10)) || 1,
    currentPage: parseInt(page, 10),
    totalCount
  };
};

module.exports = { buildJobQuery, paginateJobs };
