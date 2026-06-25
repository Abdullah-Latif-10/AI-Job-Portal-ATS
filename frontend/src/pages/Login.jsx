import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Leaf, Eye, EyeOff } from "lucide-react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import ThemeToggle from "../components/ThemeToggle";

const ROLES = [
  { id: "candidate", label: "Candidate", to: "/candidate" },
  { id: "recruiter", label: "Recruiter", to: "/recruiter" },
  { id: "admin", label: "Admin", to: "/admin" },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, isAuthenticated } = useAuth();
  
  const [role, setRole] = useState(ROLES[0]);
  const [showPassword, setShowPassword] = useState(false);
  
  // Cleaned: Removed default dummy values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Email verification states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const getRolePath = (roleName) => {
    switch (roleName) {
      case "Admin":
        return "/admin";
      case "Recruiter":
        return "/recruiter";
      default:
        return "/candidate";
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname || getRolePath(user.roleId?.name || "Candidate");
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  // Read ?role= query param to select role tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get("role");
    if (roleParam) {
      const matched = ROLES.find(r => r.id.toLowerCase() === roleParam.toLowerCase());
      if (matched) {
        setRole(matched);
      }
    }
  }, [location.search]);

  // Resend code countdown timer
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await API.post("/auth/login", {
        email,
        password
      });
      
      await login(response.data.accessToken || response.data.token, response.data.user);
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.isVerified === false) {
        setVerificationEmail(err.response.data.email || email);
        setIsVerifying(true);
        toast.success("Verification code sent to your email!");
      } else {
        setError(err.response?.data?.message || "Invalid credentials");
      }
    } 
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setVerificationError("");

    try {
      const response = await API.post("/auth/verify-email", {
        email: verificationEmail,
        code: verificationCode
      });
      toast.success("Email verified successfully!");
      await login(response.data.accessToken || response.data.token, response.data.user);
    } catch (err) {
      setVerificationError(err.response?.data?.message || "Invalid or expired verification code.");
    }
  };

  const handleResendCode = async () => {
    if (resendCountdown > 0 || isResending) return;
    setVerificationError("");
    setIsResending(true);

    try {
      await API.post("/auth/resend-verification", {
        email: verificationEmail
      });
      setResendCountdown(30);
      toast.success("Verification code resent successfully!");
    } catch (err) {
      setVerificationError(err.response?.data?.message || "Failed to resend verification code.");
    } finally {
      setIsResending(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-background relative">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 justify-center mb-8 no-underline text-foreground">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Leaf className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold tracking-tight">Hireloop</span>
          </Link>

          <div className="rounded-3xl bg-card border border-border p-7 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] animate-fade-in">
            <h1 className="text-xl font-semibold tracking-tight text-center">Verify your email</h1>
            <p className="text-sm text-muted-foreground text-center mt-2">
              We sent a 6-digit verification code to <span className="font-medium text-foreground">{verificationEmail}</span>.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleVerifySubmit}>
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full text-center rounded-xl border border-input bg-background px-4 py-3 text-lg font-bold tracking-[8px] focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:tracking-normal placeholder:font-normal"
                required
              />

              {verificationError && (
                <p className="text-xs text-destructive text-center font-medium">{verificationError}</p>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition border-0 cursor-pointer active:scale-[0.98]"
              >
                Verify Code
              </button>
            </form>

            <div className="mt-5 text-center text-xs">
              <button
                type="button"
                disabled={resendCountdown > 0 || isResending}
                onClick={handleResendCode}
                className="text-primary hover:underline font-medium bg-transparent border-0 cursor-pointer disabled:text-muted-foreground disabled:no-underline"
              >
                {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : "Resend code"}
              </button>
            </div>

            <div className="mt-4 border-t border-border pt-4 text-center">
              <button
                type="button"
                onClick={() => setIsVerifying(false)}
                className="text-xs text-muted-foreground hover:text-foreground bg-transparent border-0 cursor-pointer font-medium"
              >
                Back to sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-background relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        {/* Fixed: Changed <a> with 'to' to a proper React Router <Link> */}
        <Link to="/" className="flex items-center gap-2 justify-center mb-8 no-underline text-foreground">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Leaf className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold tracking-tight">Hireloop</span>
        </Link>

        <div className="rounded-3xl bg-card border border-border p-7 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)]">
          <h1 className="text-xl font-semibold tracking-tight text-center">Welcome back</h1>
          <p className="text-sm text-muted-foreground text-center mt-1.5">Sign in to continue</p>

          {error && <p className="text-xs text-destructive text-center mt-2 font-medium">{error}</p>}

          <div className="mt-6 grid grid-cols-3 gap-1.5 bg-muted p-1 rounded-xl">
            {ROLES.map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => handleRoleChange(r)}
                className={`text-xs font-medium py-2 rounded-lg transition border-0 cursor-pointer ${
                  role.id === r.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground bg-transparent"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form className="mt-5 space-y-3" onSubmit={handleLoginSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              placeholder="you@example.com"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground bg-transparent border-0 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition border-0 cursor-pointer active:scale-[0.98]"
            >
              Sign in as {role.label}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5 text-[11px] uppercase tracking-wider text-muted-foreground select-none">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin} 
            className="w-full border google-btn border-border bg-background py-3 rounded-xl text-sm font-medium hover:bg-muted transition cursor-pointer active:scale-[0.98] text-foreground"
          >
            Continue with Google
          </button>

          <p className="text-xs text-muted-foreground text-center mt-5">
            New here?{" "}
            {/* Fixed: Changed <a> with 'to' to a proper React Router <Link> */}
            <Link to="/signup" className="text-foreground hover:underline font-medium">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}