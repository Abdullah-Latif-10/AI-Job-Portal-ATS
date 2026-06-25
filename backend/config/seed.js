const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Role = require('../models/Role');
const User = require('../models/User');
const Job = require('../models/Job');
const CandidateProfile = require('../models/CandidateProfile');
const Application = require('../models/Application');
const CompanyProfile = require('../models/CompanyProfile');
const Interview = require('../models/Interview');

const seedDB = async () => {
  try {
    console.log('Running database seed...');

    // Drop obsolete username index if it exists to prevent E11000 duplicate key error
    try {
      const indexes = await mongoose.connection.db.collection('users').indexes();
      const hasUsernameIndex = indexes.some(idx => idx.name === 'username_1');
      if (hasUsernameIndex) {
        await mongoose.connection.db.collection('users').dropIndex('username_1');
        console.log('Dropped obsolete username_1 index.');
      }
    } catch (e) {
      console.log('Error checking/dropping index username_1:', e.message);
    }

    // 1. Seed Roles (always required)
    let candidateRole = await Role.findOne({ name: 'Candidate' });
    let recruiterRole = await Role.findOne({ name: 'Recruiter' });
    let adminRole = await Role.findOne({ name: 'Admin' });

    if (!candidateRole) {
      candidateRole = await Role.create({ name: 'Candidate', permissions: ['apply:jobs'] });
      console.log('Seeded Candidate role.');
    }
    if (!recruiterRole) {
      recruiterRole = await Role.create({ name: 'Recruiter', permissions: ['post:jobs', 'view:applicants'] });
      console.log('Seeded Recruiter role.');
    }
    if (!adminRole) {
      adminRole = await Role.create({ name: 'Admin', permissions: ['manage:all'] });
      console.log('Seeded Admin role.');
    }

    if (process.env.SEED_DEMO !== 'true') {
      console.log('Skipping demo data (set SEED_DEMO=true to seed demo users/jobs).');
      return;
    }

    console.log('Seeding demo data...');

    // 2. Seed Users
    let candidateUser = await User.findOne({ email: 'candidate@hireloop.app' });
    let recruiterUser = await User.findOne({ email: 'recruiter@hireloop.app' });
    let adminUser = await User.findOne({ email: 'admin@hireloop.app' });

    const hashedPassword = await bcrypt.hash('demo1234', 10);

    if (!candidateUser) {
      candidateUser = await User.create({
        firstName: 'Maya',
        lastName: 'Iyer',
        email: 'candidate@hireloop.app',
        password: hashedPassword,
        roleId: candidateRole._id,
        isVerified: true
      });
      console.log('Seeded candidate user (candidate@hireloop.app / demo1234)');
    }

    if (!recruiterUser) {
      recruiterUser = await User.create({
        firstName: 'Priya',
        lastName: 'Shah',
        email: 'recruiter@hireloop.app',
        password: hashedPassword,
        roleId: recruiterRole._id,
        isVerified: true
      });
      console.log('Seeded recruiter user (recruiter@hireloop.app / demo1234)');
    }

    if (!adminUser) {
      adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'Hireloop',
        email: 'admin@hireloop.app',
        password: hashedPassword,
        roleId: adminRole._id,
        isVerified: true
      });
      console.log('Seeded admin user (admin@hireloop.app / demo1234)');
    }

    // 3. Seed Mock Companies (Sprint 7 integration requirement)
    let companiesMap = {};
    const mockCompanies = [
      {
        name: 'TechVanguard Solutions',
        description: 'Enterprise SaaS company building performant, accessible web dashboards for modern teams.',
        website: 'https://techvanguard.io',
        logo: { url: 'https://example.com/logos/techvanguard.png', publicId: '' },
        recruiterId: recruiterUser._id,
        industry: 'SaaS / Frontend',
        size: '50–200',
        status: 'Approved'
      },
      {
        name: 'Apex Digital Labs',
        description: 'Fast-growing e-commerce platform team shipping robust APIs and modern user interfaces.',
        website: 'https://apexdigitallabs.com',
        logo: { url: 'https://example.com/logos/apex.png', publicId: '' },
        recruiterId: recruiterUser._id,
        industry: 'E-commerce',
        size: '100–500',
        status: 'Approved'
      },
      {
        name: 'CloudScale Systems',
        description: 'Cloud infrastructure specialists optimizing data ingestion microservices at scale.',
        website: 'https://cloudscale.systems',
        logo: { url: '', publicId: '' },
        recruiterId: recruiterUser._id,
        industry: 'Cloud Infrastructure',
        size: '200–500',
        status: 'Approved'
      },
      {
        name: 'Spark Mobile Apps',
        description: 'Cross-platform mobile studio building consumer apps for Android and iOS.',
        website: 'https://sparkmobile.app',
        logo: { url: 'https://example.com/logos/spark.png', publicId: '' },
        recruiterId: recruiterUser._id,
        industry: 'Mobile Apps',
        size: '10–50',
        status: 'Approved'
      },
      {
        name: 'Quantum Cyber Security',
        description: 'Security-first SaaS company protecting high-traffic cloud architectures.',
        website: 'https://quantumcyber.io',
        logo: { url: 'https://example.com/logos/quantum.png', publicId: '' },
        recruiterId: recruiterUser._id,
        industry: 'Cybersecurity',
        size: '500–2000',
        status: 'Approved'
      },
      {
        name: 'Canvas Creative Studio',
        description: 'Design studio crafting interactive flows and component kits for custom web portals.',
        website: 'https://canvascreative.studio',
        logo: { url: 'https://example.com/logos/canvas.png', publicId: '' },
        recruiterId: recruiterUser._id,
        industry: 'Design Studio',
        size: '10–50',
        status: 'Approved'
      },
      {
        name: 'Neural Cortex AI',
        description: 'AI research lab scaling text analysis tools and fine-tuned language models.',
        website: 'https://neuralcortex.ai',
        logo: { url: 'https://example.com/logos/neural.png', publicId: '' },
        recruiterId: recruiterUser._id,
        industry: 'Artificial Intelligence',
        size: '50–200',
        status: 'Approved'
      },
      {
        name: 'LaunchPad Hatchery',
        description: 'Startup incubator building internal tools and developer productivity dashboards.',
        website: 'https://launchpadhatchery.com',
        logo: { url: '', publicId: '' },
        recruiterId: recruiterUser._id,
        industry: 'Startup Incubator',
        size: '1–10',
        status: 'Pending'
      },
      {
        name: 'SafeVault FinTech',
        description: 'Secure mobile and web banking platform with rigorous compliance requirements.',
        website: 'https://safevault.finance',
        logo: { url: 'https://example.com/logos/safevault.png', publicId: '' },
        recruiterId: recruiterUser._id,
        industry: 'FinTech',
        size: '200–500',
        status: 'Approved'
      },
      {
        name: 'DevDoc Analytics',
        description: 'Developer documentation platform publishing guides, tutorials, and API references.',
        website: 'https://devdoc.analytics',
        logo: { url: 'https://example.com/logos/devdoc.png', publicId: '' },
        recruiterId: recruiterUser._id,
        industry: 'Developer Tools',
        size: '10–50',
        status: 'Approved'
      }
    ];

    for (const comp of mockCompanies) {
      let existingCompany = await CompanyProfile.findOne({ name: comp.name });
      if (!existingCompany) {
        existingCompany = await CompanyProfile.create(comp);
        console.log(`Seeded company: ${comp.name}`);
      }
      companiesMap[comp.name] = existingCompany._id;
    }

    // Set demo recruiter companyId to TechVanguard Solutions
    if (recruiterUser && !recruiterUser.companyId && companiesMap['TechVanguard Solutions']) {
      recruiterUser.companyId = companiesMap['TechVanguard Solutions'];
      await recruiterUser.save();
      console.log('Updated recruiter user with TechVanguard Solutions companyId.');
    }

    // 4. Seed Jobs
    const jobCount = await Job.countDocuments();
    let jobsMap = {};

    if (jobCount === 0) {
      const mockJobs = [
        {
          title: 'Senior Frontend Developer',
          company: 'TechVanguard Solutions',
          companyLogo: '',
          location: 'San Francisco, CA',
          type: 'Full-time',
          remote: true,
          salary: '$120,000 - $140,000',
          salaryMin: 120000,
          salaryMax: 140000,
          postedDays: 2,
          skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
          description: 'We are looking for a Senior Frontend Developer to lead our core dashboard redesign. You will work closely with UX designers to build highly performant, accessible web applications.',
          responsibilities: [
            'Architect and build scalable frontend features using React and TypeScript.',
            'Optimize web applications for maximum speed and scalability.',
            'Mentor junior and mid-level frontend engineers.'
          ],
          requirements: [
            '5+ years of professional full-stack or frontend development experience.',
            'Deep understanding of modern state management tools (Redux, Zustand, or Context API).',
            'Experience with server-side rendering (SSR) frameworks like Next.js.'
          ],
          status: 'Open',
          postedBy: recruiterUser._id
        },
        {
          title: 'MERN Stack Engineer',
          company: 'Apex Digital Labs',
          companyLogo: '',
          location: 'Austin, TX',
          type: 'Full-time',
          remote: false,
          salary: '$90,000 - $110,000',
          salaryMin: 90000,
          salaryMax: 110000,
          postedDays: 5,
          skills: ['MongoDB', 'Express.js', 'React', 'Node.js', 'REST APIs'],
          description: 'Join our fast-growing team to build and maintain robust APIs and modern user interfaces for our flagship e-commerce platform.',
          responsibilities: [
            'Design and implement scalable MongoDB schemas and backend business logic.',
            'Integrate secure third-party payment gateways and OAuth authentication flow.',
            'Collaborate with the DevOps team to deploy features onto AWS.'
          ],
          requirements: [
            '3+ years of experience working with Node.js and React backend/frontend environments.',
            'Strong understanding of asynchronous programming and database optimization.',
            'Familiarity with Git and Agile/Scrum workflows.'
          ],
          status: 'Open',
          postedBy: recruiterUser._id
        },
        {
          title: 'Backend UI/API Developer',
          company: 'CloudScale Systems',
          companyLogo: '',
          location: 'Seattle, WA',
          type: 'Contract',
          remote: true,
          salary: '$70 - $85 / hr',
          salaryMin: 140000,
          salaryMax: 170000,
          postedDays: 1,
          skills: ['Node.js', 'GraphQL', 'Mongoose', 'Docker'],
          description: 'Looking for a seasoned backend contractor to streamline our core data ingestion microservices and optimize heavy MongoDB queries.',
          responsibilities: [
            'Refactor legacy Node.js endpoints into efficient GraphQL resolvers.',
            'Implement advanced database indexing schemas using Mongoose.',
            'Containerize microservices using Docker for local and staging environments.'
          ],
          requirements: [
            'Expert knowledge of Node.js event-loop and multi-threading options.',
            'Proven track record of optimizing database aggregations for large datasets.',
            'Available for a 6-month dedicated contract.'
          ],
          status: 'Open',
          postedBy: recruiterUser._id
        },
        {
          title: 'React Native Intern',
          company: 'Spark Mobile Apps',
          companyLogo: '',
          location: 'New York, NY',
          type: 'Internship',
          remote: false,
          salary: '$25 / hr',
          salaryMin: 40000,
          salaryMax: 50000,
          postedDays: 0,
          skills: ['React Native', 'JavaScript', 'CSS', 'Git'],
          description: 'We are looking for an enthusiastic mobile development intern eager to learn the ropes of building cross-platform Android and iOS applications.',
          responsibilities: [
            'Assist in building pixel-perfect UI screens based on Figma wireframes.',
            'Write clean, component-driven React Native code.',
            'Debug cross-platform UI glitches across multiple device sizes.'
          ],
          requirements: [
            'Basic understanding of JavaScript (ES6+) and modern React concepts.',
            'An active Github profile displaying personal or academic frontend projects.',
            'Currently pursuing or recently completed a degree in Computer Science or a related field.'
          ],
          status: 'Open',
          postedBy: recruiterUser._id
        },
        {
          title: 'DevOps Engineer',
          company: 'Quantum Cyber Security',
          companyLogo: '',
          location: 'Remote, US',
          type: 'Full-time',
          remote: true,
          salary: '$130,000 - $160,000',
          salaryMin: 130000,
          salaryMax: 160000,
          postedDays: 12,
          skills: ['AWS', 'CI/CD', 'Kubernetes', 'Terraform'],
          description: 'Manage, protect, and scale our cloud architecture. You will own the infrastructure pipeline, ensuring zero-downtime deployments.',
          responsibilities: [
            'Maintain and expand Infrastructure as Code (IaC) using Terraform.',
            'Manage container orchestration setups using managed Kubernetes clusters.',
            'Configure automated GitHub Actions pipelines for multi-stage deployments.'
          ],
          requirements: [
            '4+ years acting as a cloud or DevOps engineer in high-traffic SaaS environments.',
            'Deep understanding of AWS security profiles, VPCs, and IAM roles.',
            'Solid scripting skills using Bash or Python.'
          ],
          status: 'Open',
          postedBy: recruiterUser._id
        },
        {
          title: 'UI/UX Product Designer',
          company: 'Canvas Creative Studio',
          companyLogo: '',
          location: 'Los Angeles, CA',
          type: 'Part-time',
          remote: true,
          salary: '$45,000',
          salaryMin: 45000,
          salaryMax: 45000,
          postedDays: 8,
          skills: ['Figma', 'Adobe XD', 'Wireframing', 'Prototyping'],
          description: 'We need a part-time UI/UX designer to craft interactive flows, component kits, and high-fidelity mockups for custom web portals.',
          responsibilities: [
            'Conduct occasional user research and map out logical user journeys.',
            'Build comprehensive design systems and interactive prototypes in Figma.',
            'Handoff visual designs neatly to the frontend engineering team.'
          ],
          requirements: [
            'A strong design portfolio showing real web layout and SaaS product design examples.',
            'Clear understanding of accessibility standards (WCAG guidelines).',
            'Ability to dedicate 20 hours per week reliably.'
          ],
          status: 'Open',
          postedBy: recruiterUser._id
        },
        {
          title: 'Machine Learning Engineer',
          company: 'Neural Cortex AI',
          companyLogo: '',
          location: 'Boston, MA',
          type: 'Full-time',
          remote: false,
          salary: '$150,000 - $180,000',
          salaryMin: 150000,
          salaryMax: 180000,
          postedDays: 3,
          skills: ['Python', 'PyTorch', 'NLP', 'Scikit-Learn'],
          description: 'We are scaling our core AI text analysis tool. You will train, deploy, and monitor fine-tuned open-source language models.',
          responsibilities: [
            'Pre-process and cleanse complex, multi-source unstructured text datasets.',
            'Fine-tune transformer models for domain-specific categorization and matching tasks.',
            'Optimize inference systems to reduce API response latency.'
          ],
          requirements: [
            "Master's or Ph.D. in Computer Science, Data Science, or equivalent practical field experience.",
            'Strong hands-on history writing production-ready Python and training PyTorch models.',
            'Familiarity with vector databases like Pinecone or Milvus.'
          ],
          status: 'Open',
          postedBy: recruiterUser._id
        },
        {
          title: 'Full Stack Intern (Node/React)',
          company: 'LaunchPad Hatchery',
          companyLogo: '',
          location: 'Chicago, IL',
          type: 'Internship',
          remote: true,
          salary: 'Stipend Provided',
          salaryMin: null,
          salaryMax: null,
          postedDays: 14,
          skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
          description: 'Looking for a proactive, self-starting intern to join our internal tools development team for an intensive 3-month cycle.',
          responsibilities: [
            'Build small internal dashboard pages to help our support team lookup data updates.',
            'Write unit tests for basic Express routes and validation logic.',
            'Participate actively in code reviews and daily developer standups.'
          ],
          requirements: [
            'Comfortable with fundamental web basics (HTML, CSS, modern JavaScript).',
            'Has built at least one personal project connecting a frontend to a Node/Express backend.',
            'Strong communications skills and willingness to take constructive feedback.'
          ],
          status: 'Open',
          postedBy: recruiterUser._id
        },
        {
          title: 'Lead QA Automation Engineer',
          company: 'SafeVault FinTech',
          companyLogo: '',
          location: 'Denver, CO',
          type: 'Full-time',
          remote: false,
          salary: '$115,000',
          salaryMin: 115000,
          salaryMax: 115000,
          postedDays: 20,
          skills: ['Cypress', 'JavaScript', 'Selenium', 'Postman'],
          description: 'Take full control over our software regression suites. Write end-to-end user tests across our secure mobile and web banking apps.',
          responsibilities: [
            'Build and maintain a scalable end-to-end automation test suite using Cypress.',
            'Integrate automated testing gates directly into our CI/CD pipelines.',
            'Document edge cases, submit bug reports, and track resolution timelines.'
          ],
          requirements: [
            '4+ years in software QA automation with an emphasis on browser testing framework setup.',
            'Proficient in writing clean test scripts using JavaScript or TypeScript.',
            'Prior exposure to security testing or working within financial software compliance rules is a big plus.'
          ],
          status: 'Closed',
          postedBy: recruiterUser._id
        },
        {
          title: 'Technical Content Writer',
          company: 'DevDoc Analytics',
          companyLogo: '',
          location: 'Remote, UK',
          type: 'Contract',
          remote: true,
          salary: '$3,000 - $4,000 / month',
          salaryMin: 36000,
          salaryMax: 48000,
          postedDays: 6,
          skills: ['Technical Writing', 'Markdown', 'Git', 'API Documentation'],
          description: 'We need a technical writer who can read code snippets and draft clean, helpful guides, tutorials, and API endpoint documentation for full-stack developers.',
          responsibilities: [
            'Write high-quality technical blog posts and step-by-step developer documentation guides.',
            'Translate complex architectural system updates into human-readable changelogs.',
            'Review sample code scripts for clarity and completeness before publishing.'
          ],
          requirements: [
            'Proven experience writing technical tutorials or engineering documentation (Markdown/Git layout).',
            'Familiarity reading structural code syntax like JavaScript, Python, or JSON models.',
            'Exceptional written English communication skills.'
          ],
          status: 'Open',
          postedBy: recruiterUser._id
        }
      ];

      for (let index = 0; index < mockJobs.length; index++) {
        const jobData = mockJobs[index];
        const newJob = await Job.create(jobData);
        jobsMap[`j${index + 1}`] = newJob._id;
      }
      console.log('Seeded mock job listings.');
    } else {
      // Map existing jobs for application/interview references
      const existingJobs = await Job.find({});
      existingJobs.forEach((job, index) => {
        jobsMap[`j${index + 1}`] = job._id;
      });
      // Update existing jobs to ensure postedBy is set to the demo recruiter
      await Job.updateMany({ postedBy: null }, { postedBy: recruiterUser._id });
    }

    // 5. Seed Candidate Profile for candidateUser
    let profile = await CandidateProfile.findOne({ userId: candidateUser._id });
    if (!profile) {
      profile = await CandidateProfile.create({
        userId: candidateUser._id,
        phone: '+49 30 1234 5678',
        location: 'Berlin, DE',
        headline: 'Senior Frontend Engineer · React, TypeScript',
        skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'PostgreSQL', 'Tailwind', 'Figma', 'Jest'],
        summary: 'Full-stack engineer with 5 years of experience shipping consumer-facing web products. Strong React/TypeScript foundation, comfortable across the stack, and a track record of mentoring junior engineers.',
        experience: [
          { role: 'Senior Frontend Engineer', company: 'Acme Co.', period: '2023 — Present' },
          { role: 'Frontend Engineer', company: 'Helix', period: '2020 — 2023' },
          { role: 'Junior Engineer', company: 'BluePeak', period: '2019 — 2020' }
        ],
        education: [
          { degree: 'B.S. Computer Science', school: 'University of Munich', period: '2015 — 2019' }
        ],
        savedJobs: [jobsMap['j2'], jobsMap['j6']].filter(Boolean)
      });
      console.log('Seeded Maya Iyer candidate profile.');
    }

    // 6. Seed Applications
    const appCount = await Application.countDocuments({ candidateId: candidateUser._id });
    if (appCount === 0) {
      const mockApps = [
        { jobId: jobsMap['j1'], status: 'Shortlisted', matchScore: 92 },
        { jobId: jobsMap['j2'], status: 'Reviewed', matchScore: 78 },
        { jobId: jobsMap['j3'], status: 'Applied', matchScore: 64 },
        { jobId: jobsMap['j4'], status: 'Rejected', matchScore: 55 }
      ];

      for (const app of mockApps) {
        if (app.jobId) {
          await Application.create({
            jobId: app.jobId,
            candidateId: candidateUser._id,
            candidateName: 'Maya Iyer',
            candidateEmail: 'candidate@hireloop.app',
            status: app.status,
            matchScore: app.matchScore
          });
        }
      }
      console.log('Seeded mock applications for Maya.');
    }

    // 7. Seed Interviews for Maya Iyer
    const interviewCount = await Interview.countDocuments({ candidateId: candidateUser._id });
    if (interviewCount === 0 && candidateUser && recruiterUser && jobsMap['j1']) {
      await Interview.create({
        candidateId: candidateUser._id,
        candidateName: 'Maya Iyer',
        recruiterId: recruiterUser._id,
        jobId: jobsMap['j1'],
        jobTitle: 'Senior Frontend Developer',
        company: 'TechVanguard Solutions',
        date: '2026-06-25',
        time: '10:00 AM',
        mode: 'Video',
        notes: 'Technical discussion on React & state management.'
      });
      await Interview.create({
        candidateId: candidateUser._id,
        candidateName: 'Maya Iyer',
        recruiterId: recruiterUser._id,
        jobId: jobsMap['j2'] || jobsMap['j1'],
        jobTitle: 'UI/UX Product Designer',
        company: 'Canvas Creative Studio',
        date: '2026-06-26',
        time: '02:00 PM',
        mode: 'Phone',
        notes: 'Portfolio walkthrough and design system discussion.'
      });
      console.log('Seeded mock interviews for Maya Iyer.');
    }

    console.log('Database seeding checks completed successfully!');
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
  }
};

module.exports = seedDB;
