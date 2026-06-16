import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import './App.css';

// Admin
import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCompanies from "./pages/admin/AdminCompanies";

// Recruiter
import RecruiterHome from "./pages/recruiter/RecruiterHome";
import Applicants from "./pages/recruiter/Applicants";
import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import Interviews from "./pages/recruiter/Interviews";
import CompanyProfile from "./pages/recruiter/CompanyProfile";

// Candidate
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateApplications from "./pages/candidate/CandidateApplications";
import CandidateJobsBrowse from "./pages/candidate/CandidateJobsBrowse";
import CandidateSavedJobs from "./pages/candidate/CandidateSavedJobs";
import CandidateJobDetail from "./pages/candidate/CandidateJobDetail";
import CandidateProfile from "./pages/candidate/CandidateProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/companies" element={<AdminCompanies />} />

        {/* Recruiter */}
        <Route path="/recruiter" element={<RecruiterHome />} />
        <Route path="/recruiter/applicants" element={<Applicants />} />
        <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
        <Route path="/recruiter/interviews" element={<Interviews />} />
        <Route path="/recruiter/company" element={<CompanyProfile />} />

        {/* Candidate */}
        <Route path="/candidate" element={<CandidateDashboard />} />
        <Route path="/candidate/applications" element={<CandidateApplications />} />
        <Route path="/candidate/saved" element={<CandidateSavedJobs />} />
        <Route path="/candidate/profile" element={<CandidateProfile />} />
        <Route path="/candidate/jobs" element={<CandidateJobsBrowse />} />
        <Route path="/candidate/jobs/:id" element={<CandidateJobDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
