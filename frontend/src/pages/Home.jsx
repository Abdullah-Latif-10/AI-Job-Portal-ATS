import { Link, useNavigate } from "react-router-dom"; 
import { Leaf, Sparkles, Briefcase, Users, BarChart3, ArrowRight, Bot, Bell, FileSearch } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import ThemeToggle from "../components/ThemeToggle";

// 1. IMPORT THE IMAGE FILE DIRECTLY VIA VITE
import heroBg from "../assets/hero-bg.jpg";

export default function Landing() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const getDefaultDashboard = () => {
    if (!user || !user.roleId?.name) return "/candidate";
    const userRole = user.roleId.name;
    if (userRole === "Admin") return "/admin";
    if (userRole === "Recruiter") return "/recruiter";
    return "/candidate";
  };

  const handleRoleNavigation = (rolePath) => {
    const roleMap = {
      "/candidate": "Candidate",
      "/recruiter": "Recruiter",
      "/admin": "Admin"
    };
    const roleName = roleMap[rolePath];

    if (!isAuthenticated) {
      // Redirect to login page and preset the selected role tab
      navigate(`/login?role=${roleName.toLowerCase()}`);
      return;
    }

    const userRole = user?.roleId?.name;
    if (userRole === roleName) {
      navigate(rolePath);
    } else {
      toast.error(
        `Access Denied: You are logged in as a ${userRole}. Please sign out to access the ${roleName} portal.`,
        { duration: 4000 }
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 no-underline text-foreground">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">Hireloop</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <Link to="/jobs" className="hover:text-foreground no-underline text-muted-foreground transition">Browse jobs</Link>
            <a href="#features" className="hover:text-foreground no-underline text-muted-foreground transition">Features</a>
            <a href="#roles" className="hover:text-foreground no-underline text-muted-foreground transition">For teams</a>
            <a href="#how" className="hover:text-foreground no-underline text-muted-foreground transition">How it works</a>
          </nav>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <ThemeToggle />
            <Link to="/jobs" className="md:hidden text-xs font-medium text-muted-foreground hover:text-foreground px-2 py-1.5 no-underline">Jobs</Link>
            {isAuthenticated ? (
              <>
                <Link to={getDefaultDashboard()} className="inline-flex items-center text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-all active:scale-[0.97] no-underline shadow-sm">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 bg-transparent border-0 cursor-pointer transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 no-underline transition-colors">
                  Sign in
                </Link>
                <Link to="/signup" className="inline-flex items-center text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-all active:scale-[0.97] no-underline shadow-sm">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-16 md:pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          AI-powered resume analysis
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold text-foreground tracking-tight mx-auto max-w-3xl" style={{ lineHeight: "1.05" }}>
          Hiring, with a little more <span className="text-primary font-bold">calm</span>.
        </h1>
        <p className="mt-6 text-base md:text-lg text-muted-foreground mx-auto max-w-xl" style={{ textWrap: "pretty" }}>
          An end-to-end applicant tracking system with AI resume analysis, real-time interview updates, and dashboards for every role.
        </p>
        <div className="mt-9 flex items-center justify-center gap-3">
          {isAuthenticated ? (
            <Link to={getDefaultDashboard()} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition no-underline shadow-md active:scale-[0.97]">
              Go to Workspace <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link to="/jobs" className="inline-flex items-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-xl text-sm font-medium hover:bg-muted transition no-underline active:scale-[0.97]">
                Browse jobs
              </Link>
              <Link to="/signup" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition no-underline shadow-md active:scale-[0.97]">
                Start free <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
          {!isAuthenticated && (
            <button
              onClick={() => handleRoleNavigation("/candidate")}
              className="inline-flex items-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-xl text-sm font-medium hover:bg-muted transition no-underline active:scale-[0.97] cursor-pointer"
            >
              View demo
            </button>
          )}
        </div>

        {/* Preview image Container */}
        <div className="mt-16 mx-auto max-w-5xl">
          <div className="rounded-3xl border border-border bg-card p-2 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)]">
            {/* 2. RENDER THE IMAGE DIRECTLY USING THE IMPORT VARIABLE */}
            <img
              src={heroBg}
              alt="Hireloop dashboard preview"
              className="rounded-2xl w-full aspect-[16/9] object-cover border border-border/40"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground" style={{ lineHeight: "1.1" }}>Everything you need to hire well.</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">No bloat. Just the right primitives for every side of the hiring loop.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Bot, title: "AI resume analysis", desc: "Skills extracted, summaries generated, candidates matched — automatically." },
            { icon: Bell, title: "Real-time updates", desc: "Interview scheduling and status changes pushed live via Socket.io." },
            { icon: FileSearch, title: "Smart search & filters", desc: "Find the right candidate or role in seconds, with pagination built in." },
            { icon: Briefcase, title: "Job posting", desc: "Recruiters publish, manage, and close roles from a clean workspace." },
            { icon: Users, title: "Applicant tracking", desc: "End-to-end pipeline from Applied → Reviewed → Shortlisted → Hired." },
            { icon: BarChart3, title: "Admin analytics", desc: "Live counts, charts, and platform health for administrators." },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border p-6 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold tracking-tight text-foreground">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground" style={{ textWrap: "pretty" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground" style={{ lineHeight: "1.1" }}>One platform, three perspectives.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { rolePath: "/candidate", title: "For candidates", desc: "Build a profile, upload your resume, and let AI surface the roles that match you.", cta: "Open candidate view" },
            { rolePath: "/recruiter", title: "For recruiters", desc: "Post roles, review AI-ranked applicants, shortlist, and schedule interviews.", cta: "Open recruiter view" },
            { rolePath: "/admin", title: "For admins", desc: "Manage users and companies. Track platform health with live charts.", cta: "Open admin view" },
          ].map((r, i) => (
            <button
              key={i}
              onClick={() => handleRoleNavigation(r.rolePath)}
              className="rounded-2xl bg-card border border-border p-6 hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 group no-underline text-foreground text-left cursor-pointer"
            >
              <h3 className="font-semibold tracking-tight text-lg text-foreground">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground" style={{ textWrap: "pretty" }}>{r.desc}</p>
              <div className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary font-medium">
                {r.cta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground" style={{ lineHeight: "1.1" }}>From resume to offer, in one loop.</h2>
            <p className="mt-4 text-muted-foreground" style={{ textWrap: "pretty" }}>
              Candidates apply once. Recruiters get ranked shortlists. Admins see the whole picture. No spreadsheets, no chasing email threads.
            </p>
          </div>
          <ol className="space-y-3 p-0 list-none">
            {[
              "Candidate uploads resume",
              "AI extracts skills & generates summary",
              "Recruiter reviews ranked applicants",
              "Interview scheduled in one click",
              "Status updates land in real time",
            ].map((step, i) => (
              <li key={i} className="flex items-center gap-4 rounded-xl bg-card border border-border p-4">
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">{i + 1}</div>
                <span className="text-sm text-foreground font-medium">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pb-24">
        <div className="rounded-3xl bg-primary text-primary-foreground p-10 md:p-16 text-center shadow-lg">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary-foreground" style={{ lineHeight: "1.1" }}>Ready to make hiring feel calm?</h2>
          <p className="mt-3 text-primary-foreground/80 max-w-md mx-auto text-sm">Try the demo with seeded data — no signup required.</p>
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => handleRoleNavigation("/candidate")}
              className="bg-background border-0 text-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-background/90 transition no-underline shadow-sm active:scale-[0.97] cursor-pointer"
            >
              Candidate demo
            </button>
            <button
              onClick={() => handleRoleNavigation("/recruiter")}
              className="bg-transparent border border-primary-foreground/20 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-foreground/10 transition no-underline active:scale-[0.97] cursor-pointer"
            >
              Recruiter demo
            </button>
            <button
              onClick={() => handleRoleNavigation("/admin")}
              className="bg-transparent border border-primary-foreground/20 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-foreground/10 transition no-underline active:scale-[0.97] cursor-pointer"
            >
              Admin demo
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground tracking-wide">
        © 2026 Hireloop. A calm, AI-powered hiring platform.
      </footer>
    </div>
  );
}