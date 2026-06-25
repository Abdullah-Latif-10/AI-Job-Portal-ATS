import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Simple helper function to decode a JWT payload without an external library
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Login via context and redirect appropriately
      login(token).then(() => {
        const decoded = decodeToken(token);
        const userRole = decoded?.roleName; 

        if (userRole === 'Candidate') {
          navigate('/candidate', { replace: true });
        } else if (userRole === 'Recruiter') {
          navigate('/recruiter', { replace: true });
        } else if (userRole === 'Admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      }).catch((err) => {
        console.error("OAuth login failed in context:", err);
        navigate('/login', { replace: true });
      });
    } else {
      navigate('/login', { replace: true });
    }
  }, [location, navigate, login]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-2">
      <h2 className="text-lg font-semibold tracking-tight">Syncing with Google...</h2>
      <p className="text-xs text-muted-foreground">Redirecting you to your workspace.</p>
    </div>
  );
};

export default OAuthSuccess;