import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // 1. Swapped out window links for React Router
import { Leaf, Eye, EyeOff } from "lucide-react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import ThemeToggle from "../components/ThemeToggle";

const ROLES = [
  { id: "Candidate", label: "I'm a candidate", desc: "Looking for my next role", to: "/candidate" },
  { id: "Recruiter", label: "I'm a recruiter", desc: "Hiring for my company", to: "/recruiter" },
];

export default function Signup() {
  const navigate = useNavigate(); // 2. Initialized programmatic redirect hook
  const { user, login, isAuthenticated } = useAuth();
  
  const [role, setRole] = useState(ROLES[0]); // 3. Removed TS type annotations
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Cleaned: Removed dummy credentials
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);

  // Email verification states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const getRolePath = (roleName) => {
        if (roleName === "Admin") return "/admin";
        if (roleName === "Recruiter") return "/recruiter";
        return "/candidate";
      };
      navigate(getRolePath(user.roleId?.name || "Candidate"), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Resend code countdown timer
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Front-end Form Validations
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    if (!firstName) {
      setError("Please enter your full name");
      return;
    }

    try {
      const response = await API.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
        role: role.id
      });
      
      setVerificationEmail(email);
      setIsVerifying(true);
      toast.success("Verification code sent to your email!");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong during sign up.");
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
      <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-background text-foreground relative">
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
                Back to registration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-background text-foreground relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        {/* Fixed: Swapped <a> tag to <Link> to protect routing state cache */}
        <Link to="/" className="flex items-center gap-2 justify-center mb-8 no-underline text-foreground">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Leaf className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold tracking-tight">Hireloop</span>
        </Link>

        <div className="rounded-3xl bg-card border border-border p-7 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)]">
          <h1 className="text-xl font-semibold tracking-tight text-center">Create your account</h1>
          <p className="text-sm text-muted-foreground text-center mt-1.5">Start hiring or job hunting in seconds</p>

          <div className="mt-6 space-y-2">
            {ROLES.map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => setRole(r)}
                className={`w-full text-left rounded-xl p-3.5 border transition cursor-pointer ${
                  role.id === r.id ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted"
                }`}
              >
                <div className="text-sm font-medium text-foreground">{r.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
              </button>
            ))}
          </div>

          <form className="mt-5 space-y-3" onSubmit={handleSignupSubmit}>
            <input 
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground" 
              placeholder="Full name" 
              required
            />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground" 
              placeholder="Email" 
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
            
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground bg-transparent border-0 cursor-pointer"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {error && <p className="text-xs text-destructive font-medium mt-1">{error}</p>}
            
            <button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition border-0 cursor-pointer active:scale-[0.98]"
            >
              Create account
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-5">
            Have an account?{" "}
            {/* Fixed: Replaced raw anchor link with smooth React Router transition element */}
            <Link to="/login" className="text-foreground hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}