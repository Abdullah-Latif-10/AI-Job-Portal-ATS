import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // 1. Added proper routing imports
import { Leaf, Eye, EyeOff } from "lucide-react";
import axios from "axios"; // Prepared for your API call later

const ROLES = [
  { id: "candidate", label: "Candidate", to: "/candidate" },
  { id: "recruiter", label: "Recruiter", to: "/recruiter" },
  { id: "admin", label: "Admin", to: "/admin" },
];

export default function Login() {
  const navigate = useNavigate(); // 2. Initialized the hook for route redirection
  const [role, setRole] = useState(ROLES[0]); // 3. Removed TS syntax for standard .jsx compilation
  const [showPassword, setShowPassword] = useState(false);
  
  // Added local state to manage input changes for backend connectivity
  const [email, setEmail] = useState(`${ROLES[0].id}@hireloop.app`);
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setEmail(`${selectedRole.id}@hireloop.app`); // Syncs mock credentials instantly
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // --- SPRINT 1 MERN CONNECTIVITY ---
    // Un-comment this block when your Express Auth route is live!

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        role: role.id // Sends selected role checking directly to your RBAC middleware
      });
      
      localStorage.setItem("token", response.data.token);
      navigate(role.to);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      return;
    }
  

    // Temporary client-side redirect for mock demo flow
    navigate(role.to);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-background">
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
            onClick={() => navigate(role.to)}
            className="w-full border border-border bg-background py-3 rounded-xl text-sm font-medium hover:bg-muted transition cursor-pointer active:scale-[0.98] text-foreground"
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