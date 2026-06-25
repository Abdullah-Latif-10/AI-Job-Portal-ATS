import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OAuthSuccess from './components/OAuthSuccess';
import Signup from "./pages/signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SocketProvider } from "./context/SocketContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
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
import CandidateInterviews from "./pages/candidate/CandidateInterviews";
import PublicJobs from "./pages/PublicJobs";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ErrorBoundary>
          <SocketProvider>
            <Toaster position="top-center" />
            <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/jobs" element={<PublicJobs />} />
          <Route path="/jobs/:id" element={<CandidateJobDetail publicView />} />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminHome />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/companies" element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminCompanies />
            </ProtectedRoute>
          } />

          {/* Recruiter */}
          <Route path="/recruiter" element={
            <ProtectedRoute allowedRoles={["Recruiter"]}>
              <RecruiterHome />
            </ProtectedRoute>
          } />
          <Route path="/recruiter/applicants" element={
            <ProtectedRoute allowedRoles={["Recruiter"]}>
              <Applicants />
            </ProtectedRoute>
          } />
          <Route path="/recruiter/jobs" element={
            <ProtectedRoute allowedRoles={["Recruiter"]}>
              <RecruiterJobs />
            </ProtectedRoute>
          } />
          <Route path="/recruiter/interviews" element={
            <ProtectedRoute allowedRoles={["Recruiter"]}>
              <Interviews />
            </ProtectedRoute>
          } />
          <Route path="/recruiter/company" element={
            <ProtectedRoute allowedRoles={["Recruiter"]}>
              <CompanyProfile />
            </ProtectedRoute>
          } />

          {/* Candidate */}
          <Route path="/candidate" element={
            <ProtectedRoute allowedRoles={["Candidate"]}>
              <CandidateDashboard />
            </ProtectedRoute>
          } />
          <Route path="/candidate/applications" element={
            <ProtectedRoute allowedRoles={["Candidate"]}>
              <CandidateApplications />
            </ProtectedRoute>
          } />
          <Route path="/candidate/saved" element={
            <ProtectedRoute allowedRoles={["Candidate"]}>
              <CandidateSavedJobs />
            </ProtectedRoute>
          } />
          <Route path="/candidate/profile" element={
            <ProtectedRoute allowedRoles={["Candidate"]}>
              <CandidateProfile />
            </ProtectedRoute>
          } />
          <Route path="/candidate/interviews" element={
            <ProtectedRoute allowedRoles={["Candidate"]}>
              <CandidateInterviews />
            </ProtectedRoute>
          } />
          <Route path="/candidate/jobs" element={
            <ProtectedRoute allowedRoles={["Candidate"]}>
              <CandidateJobsBrowse />
            </ProtectedRoute>
          } />
          <Route path="/candidate/jobs/:id" element={
            <ProtectedRoute allowedRoles={["Candidate"]}>
              <CandidateJobDetail />
            </ProtectedRoute>
          } />
        </Routes>
          </SocketProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
