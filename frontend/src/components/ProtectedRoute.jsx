import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-xs text-muted-foreground tracking-wide font-medium">Verifying access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and preserve original path to navigate back after successful sign-in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user?.roleId?.name;

  if (!allowedRoles.includes(userRole)) {
    // Access denied for this role, redirect to their home dashboard
    console.warn(`Access denied. User role: "${userRole}", Allowed roles: ${JSON.stringify(allowedRoles)}`);
    
    if (userRole === "Candidate") {
      return <Navigate to="/candidate" replace />;
    }
    if (userRole === "Recruiter") {
      return <Navigate to="/recruiter" replace />;
    }
    if (userRole === "Admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
