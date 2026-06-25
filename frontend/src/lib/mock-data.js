import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Bookmark, 
  User, 
  Users, 
  Calendar, 
  Building2, 
  BarChart3 
} from "lucide-react";

// --- Navigation Configurations ---
export const candidateNav = [
  { to: "/candidate", label: "Home", icon: LayoutDashboard },
  { to: "/candidate/jobs", label: "Jobs", icon: Briefcase },
  { to: "/candidate/applications", label: "Applications", icon: FileText },
  { to: "/candidate/interviews", label: "Interviews", icon: Calendar },
  { to: "/candidate/saved", label: "Saved", icon: Bookmark },
  { to: "/candidate/profile", label: "Profile", icon: User },
];

export const recruiterNav = [
  { to: "/recruiter", label: "Home", icon: LayoutDashboard },
  { to: "/recruiter/jobs", label: "Jobs", icon: Briefcase },
  { to: "/recruiter/applicants", label: "Applicants", icon: Users },
  { to: "/recruiter/interviews", label: "Interviews", icon: Calendar },
  { to: "/recruiter/company", label: "Company", icon: Building2 },
];

export const adminNav = [
  { to: "/admin", label: "Overview", icon: BarChart3 },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/companies", label: "Companies", icon: Building2 },
];

// --- Static Collections (reference data; live views use the API) ---
const companies = [
  { name: "TechVanguard Solutions", logo: "https://example.com/logos/techvanguard.png" },
  { name: "Apex Digital Labs", logo: "https://example.com/logos/apex.png" },
  { name: "CloudScale Systems", logo: "" },
  { name: "Spark Mobile Apps", logo: "https://example.com/logos/spark.png" },
  { name: "Quantum Cyber Security", logo: "https://example.com/logos/quantum.png" },
  { name: "Canvas Creative Studio", logo: "https://example.com/logos/canvas.png" },
  { name: "Neural Cortex AI", logo: "https://example.com/logos/neural.png" },
  { name: "LaunchPad Hatchery", logo: "" },
  { name: "SafeVault FinTech", logo: "https://example.com/logos/safevault.png" },
  { name: "DevDoc Analytics", logo: "https://example.com/logos/devdoc.png" },
];

export const JOBS = [
  {
    id: "j1", title: "Senior Frontend Developer", company: "TechVanguard Solutions",
    companyLogo: "https://example.com/logos/techvanguard.png",
    location: "San Francisco, CA", type: "Full-time", remote: true, salary: "$120,000 - $140,000", postedDays: 2,
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    description: "We are looking for a Senior Frontend Developer to lead our core dashboard redesign.",
    responsibilities: ["Architect scalable frontend features", "Optimize for speed and scalability", "Mentor frontend engineers"],
    requirements: ["5+ years frontend experience", "Modern state management", "Next.js SSR experience"],
    status: "Open", applicants: 48,
  },
  {
    id: "j2", title: "MERN Stack Engineer", company: "Apex Digital Labs",
    companyLogo: "https://example.com/logos/apex.png",
    location: "Austin, TX", type: "Full-time", remote: false, salary: "$90,000 - $110,000", postedDays: 5,
    skills: ["MongoDB", "Express.js", "React", "Node.js", "REST APIs"],
    description: "Build and maintain robust APIs and modern user interfaces for our e-commerce platform.",
    responsibilities: ["Design MongoDB schemas", "Integrate payment gateways", "Deploy features onto AWS"],
    requirements: ["3+ years Node.js and React", "Async programming", "Agile workflows"],
    status: "Open", applicants: 36,
  },
  {
    id: "j3", title: "Backend UI/API Developer", company: "CloudScale Systems",
    companyLogo: "",
    location: "Seattle, WA", type: "Contract", remote: true, salary: "$70 - $85 / hr", postedDays: 1,
    skills: ["Node.js", "GraphQL", "Mongoose", "Docker"],
    description: "Streamline data ingestion microservices and optimize heavy MongoDB queries.",
    responsibilities: ["Refactor endpoints to GraphQL", "Implement database indexing", "Containerize microservices"],
    requirements: ["Expert Node.js knowledge", "Database aggregation experience", "6-month contract availability"],
    status: "Open", applicants: 22,
  },
  {
    id: "j4", title: "React Native Intern", company: "Spark Mobile Apps",
    companyLogo: "https://example.com/logos/spark.png",
    location: "New York, NY", type: "Internship", remote: false, salary: "$25 / hr", postedDays: 0,
    skills: ["React Native", "JavaScript", "CSS", "Git"],
    description: "Learn the ropes of building cross-platform Android and iOS applications.",
    responsibilities: ["Build UI screens from Figma", "Write React Native code", "Debug cross-platform UI"],
    requirements: ["JavaScript ES6+", "Github portfolio", "CS degree or related field"],
    status: "Open", applicants: 64,
  },
  {
    id: "j5", title: "DevOps Engineer", company: "Quantum Cyber Security",
    companyLogo: "https://example.com/logos/quantum.png",
    location: "Remote, US", type: "Full-time", remote: true, salary: "$130,000 - $160,000", postedDays: 12,
    skills: ["AWS", "CI/CD", "Kubernetes", "Terraform"],
    description: "Manage, protect, and scale our cloud architecture with zero-downtime deployments.",
    responsibilities: ["Maintain Terraform IaC", "Manage Kubernetes clusters", "Configure GitHub Actions pipelines"],
    requirements: ["4+ years DevOps", "AWS security expertise", "Bash or Python scripting"],
    status: "Open", applicants: 17,
  },
  {
    id: "j6", title: "UI/UX Product Designer", company: "Canvas Creative Studio",
    companyLogo: "https://example.com/logos/canvas.png",
    location: "Los Angeles, CA", type: "Part-time", remote: true, salary: "$45,000", postedDays: 8,
    skills: ["Figma", "Adobe XD", "Wireframing", "Prototyping"],
    description: "Craft interactive flows, component kits, and high-fidelity mockups for web portals.",
    responsibilities: ["Conduct user research", "Build design systems in Figma", "Handoff designs to engineering"],
    requirements: ["Strong design portfolio", "WCAG accessibility knowledge", "20 hours per week availability"],
    status: "Open", applicants: 92,
  },
  {
    id: "j7", title: "Machine Learning Engineer", company: "Neural Cortex AI",
    companyLogo: "https://example.com/logos/neural.png",
    location: "Boston, MA", type: "Full-time", remote: false, salary: "$150,000 - $180,000", postedDays: 3,
    skills: ["Python", "PyTorch", "NLP", "Scikit-Learn"],
    description: "Train, deploy, and monitor fine-tuned open-source language models.",
    responsibilities: ["Pre-process text datasets", "Fine-tune transformer models", "Optimize inference latency"],
    requirements: ["MS/PhD or equivalent", "Production Python and PyTorch", "Vector database familiarity"],
    status: "Open", applicants: 31,
  },
  {
    id: "j8", title: "Full Stack Intern (Node/React)", company: "LaunchPad Hatchery",
    companyLogo: "",
    location: "Chicago, IL", type: "Internship", remote: true, salary: "Stipend Provided", postedDays: 14,
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    description: "Join our internal tools development team for an intensive 3-month cycle.",
    responsibilities: ["Build internal dashboard pages", "Write unit tests for Express routes", "Participate in code reviews"],
    requirements: ["Web fundamentals", "Personal full-stack project", "Strong communication skills"],
    status: "Open", applicants: 41,
  },
  {
    id: "j9", title: "Lead QA Automation Engineer", company: "SafeVault FinTech",
    companyLogo: "https://example.com/logos/safevault.png",
    location: "Denver, CO", type: "Full-time", remote: false, salary: "$115,000", postedDays: 20,
    skills: ["Cypress", "JavaScript", "Selenium", "Postman"],
    description: "Write end-to-end user tests across secure mobile and web banking apps.",
    responsibilities: ["Maintain Cypress test suite", "Integrate CI/CD testing gates", "Track bug resolution"],
    requirements: ["4+ years QA automation", "JavaScript or TypeScript tests", "Financial compliance exposure a plus"],
    status: "Closed", applicants: 28,
  },
  {
    id: "j10", title: "Technical Content Writer", company: "DevDoc Analytics",
    companyLogo: "https://example.com/logos/devdoc.png",
    location: "Remote, UK", type: "Contract", remote: true, salary: "$3,000 - $4,000 / month", postedDays: 6,
    skills: ["Technical Writing", "Markdown", "Git", "API Documentation"],
    description: "Draft guides, tutorials, and API endpoint documentation for full-stack developers.",
    responsibilities: ["Write technical blog posts", "Translate system updates into changelogs", "Review sample code scripts"],
    requirements: ["Technical writing experience", "Code syntax familiarity", "Strong English communication"],
    status: "Open", applicants: 19,
  },
];

export const APPLICATIONS = [
  { id: "a1", jobId: "j1", jobTitle: "Senior Frontend Developer", company: "TechVanguard Solutions", candidateName: "Maya Iyer", candidateEmail: "candidate@hireloop.app", appliedAt: "2 days ago", status: "Shortlisted", matchScore: 92 },
  { id: "a2", jobId: "j2", jobTitle: "MERN Stack Engineer", company: "Apex Digital Labs", candidateName: "Maya Iyer", candidateEmail: "candidate@hireloop.app", appliedAt: "5 days ago", status: "Reviewed", matchScore: 78 },
  { id: "a3", jobId: "j3", jobTitle: "Backend UI/API Developer", company: "CloudScale Systems", candidateName: "Maya Iyer", candidateEmail: "candidate@hireloop.app", appliedAt: "1 week ago", status: "Applied", matchScore: 64 },
  { id: "a4", jobId: "j4", jobTitle: "React Native Intern", company: "Spark Mobile Apps", candidateName: "Maya Iyer", candidateEmail: "candidate@hireloop.app", appliedAt: "2 weeks ago", status: "Rejected", matchScore: 55 },
  { id: "a5", jobId: "j1", jobTitle: "Senior Frontend Developer", company: "TechVanguard Solutions", candidateName: "Jordan Reyes", candidateEmail: "jordan@example.com", appliedAt: "1 day ago", status: "Applied", matchScore: 88 },
  { id: "a6", jobId: "j1", jobTitle: "Senior Frontend Developer", company: "TechVanguard Solutions", candidateName: "Sasha Kim", candidateEmail: "sasha@example.com", appliedAt: "2 days ago", status: "Reviewed", matchScore: 81 },
  { id: "a7", jobId: "j1", jobTitle: "Senior Frontend Developer", company: "TechVanguard Solutions", candidateName: "Leo Marchetti", candidateEmail: "leo@example.com", appliedAt: "3 days ago", status: "Shortlisted", matchScore: 95 },
];

export const SAVED_JOBS = ["j2", "j6"];

export const INTERVIEWS = [
  { id: "i1", candidateName: "Leo Marchetti", jobTitle: "Senior Frontend Developer", company: "TechVanguard Solutions", date: "Jun 18, 2026", time: "10:00 AM CET", mode: "Video", notes: "Technical round" },
  { id: "i2", candidateName: "Maya Iyer", jobTitle: "Senior Frontend Developer", company: "TechVanguard Solutions", date: "Jun 19, 2026", time: "2:30 PM CET", mode: "Video", notes: "System design" },
  { id: "i3", candidateName: "Aiden Park", jobTitle: "UI/UX Product Designer", company: "Canvas Creative Studio", date: "Jun 20, 2026", time: "4:00 PM PST", mode: "On-site", notes: "Portfolio review" },
];

export const USERS = [
  { id: "u1", name: "Maya Iyer", email: "candidate@hireloop.app", role: "Candidate", status: "Active", joined: "Apr 2026" },
  { id: "u2", name: "Jordan Reyes", email: "jordan@example.com", role: "Candidate", status: "Active", joined: "May 2026" },
  { id: "u3", name: "Priya Shah", email: "recruiter@hireloop.app", role: "Recruiter", status: "Active", joined: "Feb 2026" },
  { id: "u4", name: "Tom Becker", email: "tom@forgestudio.com", role: "Recruiter", status: "Active", joined: "Jan 2026" },
  { id: "u5", name: "Sasha Kim", email: "sasha@example.com", role: "Candidate", status: "Suspended", joined: "Mar 2026" },
  { id: "u6", name: "Admin Hireloop", email: "admin@hireloop.app", role: "Admin", status: "Active", joined: "Jan 2026" },
];

export const COMPANIES = [
  { id: "c1", name: "TechVanguard Solutions", industry: "SaaS / Frontend", size: "50–200", jobs: 1, status: "Approved" },
  { id: "c2", name: "Apex Digital Labs", industry: "E-commerce", size: "100–500", jobs: 1, status: "Approved" },
  { id: "c3", name: "CloudScale Systems", industry: "Cloud Infrastructure", size: "200–500", jobs: 1, status: "Approved" },
  { id: "c4", name: "Spark Mobile Apps", industry: "Mobile Apps", size: "10–50", jobs: 1, status: "Approved" },
  { id: "c5", name: "Quantum Cyber Security", industry: "Cybersecurity", size: "500–2000", jobs: 1, status: "Approved" },
  { id: "c6", name: "Canvas Creative Studio", industry: "Design Studio", size: "10–50", jobs: 1, status: "Approved" },
  { id: "c7", name: "Neural Cortex AI", industry: "Artificial Intelligence", size: "50–200", jobs: 1, status: "Approved" },
  { id: "c8", name: "LaunchPad Hatchery", industry: "Startup Incubator", size: "1–10", jobs: 1, status: "Pending" },
  { id: "c9", name: "SafeVault FinTech", industry: "FinTech", size: "200–500", jobs: 1, status: "Approved" },
  { id: "c10", name: "DevDoc Analytics", industry: "Developer Tools", size: "10–50", jobs: 1, status: "Approved" },
];

export { companies };
