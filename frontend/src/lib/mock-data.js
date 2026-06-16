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

// --- Static Collections ---
const companies = [
  { name: "Northwind Labs", logo: "🌊" },
  { name: "Atlas Robotics", logo: "🤖" },
  { name: "Lumen Health", logo: "🩺" },
  { name: "Forge Studio", logo: "🔨" },
  { name: "Quanta Bank", logo: "🏦" },
  { name: "Petal & Pine", logo: "🌿" },
];

export const JOBS = [
  {
    id: "j1", title: "Senior Frontend Engineer", company: "Northwind Labs", companyLogo: "🌊",
    location: "Berlin, DE", type: "Full-time", remote: true, salary: "€80k – €110k", postedDays: 2,
    skills: ["React", "TypeScript", "GraphQL", "Tailwind"],
    description: "Build the next generation of our analytics dashboard used by 40,000+ teams.",
    responsibilities: ["Own complex UI features end-to-end", "Mentor mid-level engineers", "Collaborate with product & design"],
    requirements: ["5+ years React", "Strong TypeScript", "Production GraphQL"],
    status: "Open", applicants: 48,
  },
  {
    id: "j2", title: "Product Designer", company: "Forge Studio", companyLogo: "🔨",
    location: "Remote", type: "Full-time", remote: true, salary: "$90k – $120k", postedDays: 5,
    skills: ["Figma", "Design Systems", "Prototyping"],
    description: "Shape product experiences for our flagship creative tool.",
    responsibilities: ["Lead design for new features", "Maintain the design system", "Run user research"],
    requirements: ["4+ years product design", "Portfolio with shipped work"],
    status: "Open", applicants: 92,
  },
  {
    id: "j3", title: "ML Engineer (NLP)", company: "Atlas Robotics", companyLogo: "🤖",
    location: "San Francisco, CA", type: "Full-time", remote: false, salary: "$160k – $210k", postedDays: 1,
    skills: ["Python", "PyTorch", "LLMs", "Transformers"],
    description: "Improve our resume parsing & matching models at scale.",
    responsibilities: ["Train and evaluate NLP models", "Ship to production", "Collaborate with infra"],
    requirements: ["MS/PhD or equivalent", "Strong PyTorch", "LLM finetuning"],
    status: "Open", applicants: 31,
  },
  {
    id: "j4", title: "Backend Engineer (Node.js)", company: "Lumen Health", companyLogo: "🩺",
    location: "London, UK", type: "Full-time", remote: true, salary: "£70k – £95k", postedDays: 8,
    skills: ["Node.js", "MongoDB", "REST", "AWS"],
    description: "Scale our patient-facing telehealth platform.",
    responsibilities: ["Design APIs", "Own service reliability", "On-call rotation"],
    requirements: ["4+ years Node.js", "MongoDB at scale"],
    status: "Open", applicants: 22,
  },
  {
    id: "j5", title: "DevOps Engineer", company: "Quanta Bank", companyLogo: "🏦",
    location: "Singapore", type: "Contract", remote: false, salary: "S$140k – S$180k", postedDays: 12,
    skills: ["Kubernetes", "Terraform", "AWS", "CI/CD"],
    description: "Build platforms for the next-gen digital bank.",
    responsibilities: ["Manage K8s clusters", "Automate deploys", "Improve observability"],
    requirements: ["Strong K8s", "Terraform", "Fintech experience a plus"],
    status: "Open", applicants: 17,
  },
  {
    id: "j6", title: "Marketing Intern", company: "Petal & Pine", companyLogo: "🌿",
    location: "Amsterdam, NL", type: "Internship", remote: false, salary: "€1.2k / month", postedDays: 3,
    skills: ["Copywriting", "Social Media", "Canva"],
    description: "Support our brand team on a fast-growing wellness label.",
    responsibilities: ["Draft copy", "Schedule posts", "Light analytics"],
    requirements: ["Currently studying", "Strong writing"],
    status: "Open", applicants: 64,
  },
];

export const APPLICATIONS = [
  { id: "a1", jobId: "j1", jobTitle: "Senior Frontend Engineer", company: "Northwind Labs", candidateName: "Maya Iyer", candidateEmail: "maya@example.com", appliedAt: "2 days ago", status: "Shortlisted", matchScore: 92 },
  { id: "a2", jobId: "j2", jobTitle: "Product Designer", company: "Forge Studio", candidateName: "Maya Iyer", candidateEmail: "maya@example.com", appliedAt: "5 days ago", status: "Reviewed", matchScore: 78 },
  { id: "a3", jobId: "j3", jobTitle: "ML Engineer (NLP)", company: "Atlas Robotics", candidateName: "Maya Iyer", candidateEmail: "maya@example.com", appliedAt: "1 week ago", status: "Applied", matchScore: 64 },
  { id: "a4", jobId: "j4", jobTitle: "Backend Engineer (Node.js)", company: "Lumen Health", candidateName: "Maya Iyer", candidateEmail: "maya@example.com", appliedAt: "2 weeks ago", status: "Rejected", matchScore: 55 },
  { id: "a5", jobId: "j1", jobTitle: "Senior Frontend Engineer", company: "Northwind Labs", candidateName: "Jordan Reyes", candidateEmail: "jordan@example.com", appliedAt: "1 day ago", status: "Applied", matchScore: 88 },
  { id: "a6", jobId: "j1", jobTitle: "Senior Frontend Engineer", company: "Northwind Labs", candidateName: "Sasha Kim", candidateEmail: "sasha@example.com", appliedAt: "2 days ago", status: "Reviewed", matchScore: 81 },
  { id: "a7", jobId: "j1", jobTitle: "Senior Frontend Engineer", company: "Northwind Labs", candidateName: "Leo Marchetti", candidateEmail: "leo@example.com", appliedAt: "3 days ago", status: "Shortlisted", matchScore: 95 },
];

export const SAVED_JOBS = ["j2", "j5"];

export const INTERVIEWS = [
  { id: "i1", candidateName: "Leo Marchetti", jobTitle: "Senior Frontend Engineer", company: "Northwind Labs", date: "Jun 18, 2026", time: "10:00 AM CET", mode: "Video", notes: "Technical round" },
  { id: "i2", candidateName: "Maya Iyer", jobTitle: "Senior Frontend Engineer", company: "Northwind Labs", date: "Jun 19, 2026", time: "2:30 PM CET", mode: "Video", notes: "System design" },
  { id: "i3", candidateName: "Aiden Park", jobTitle: "Product Designer", company: "Forge Studio", date: "Jun 20, 2026", time: "4:00 PM PST", mode: "On-site", notes: "Portfolio review" },
];

export const USERS = [
  { id: "u1", name: "Maya Iyer", email: "maya@example.com", role: "Candidate", status: "Active", joined: "Apr 2026" },
  { id: "u2", name: "Jordan Reyes", email: "jordan@example.com", role: "Candidate", status: "Active", joined: "May 2026" },
  { id: "u3", name: "Priya Shah", email: "priya@northwind.io", role: "Recruiter", status: "Active", joined: "Feb 2026" },
  { id: "u4", name: "Tom Becker", email: "tom@forgestudio.com", role: "Recruiter", status: "Active", joined: "Jan 2026" },
  { id: "u5", name: "Sasha Kim", email: "sasha@example.com", role: "Candidate", status: "Suspended", joined: "Mar 2026" },
  { id: "u6", name: "Admin", email: "admin@hireloop.app", role: "Admin", status: "Active", joined: "Jan 2026" },
];

export const COMPANIES = [
  { id: "c1", name: "Northwind Labs", industry: "SaaS / Analytics", size: "200–500", jobs: 8, status: "Approved" },
  { id: "c2", name: "Forge Studio", industry: "Creative Tools", size: "50–200", jobs: 3, status: "Approved" },
  { id: "c3", name: "Atlas Robotics", industry: "AI / Robotics", size: "200–500", jobs: 5, status: "Approved" },
  { id: "c4", name: "Lumen Health", industry: "Healthtech", size: "500–1000", jobs: 4, status: "Approved" },
  { id: "c5", name: "Quanta Bank", industry: "Fintech", size: "1000+", jobs: 2, status: "Pending" },
  { id: "c6", name: "Petal & Pine", industry: "Wellness", size: "10–50", jobs: 1, status: "Approved" },
];

export { companies };