import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { DashboardShell, StatusBadge } from "@/components/DashboardShell";
import { candidateNav } from "@/lib/role-navs";
import { MapPin, Briefcase, Clock, Users, ArrowLeft, BookmarkPlus, Check, Leaf } from "lucide-react";
import { toast } from "sonner";
import API from "@/api/axios";
import ThemeToggle from "@/components/ThemeToggle";

const formatPostedAgo = (job) => {
  if (job?.postedDays > 0) return `${job.postedDays}d ago`;
  if (job?.createdAt) {
    const days = Math.max(0, Math.floor((Date.now() - new Date(job.createdAt).getTime()) / 86400000));
    if (days === 0) return "Today";
    return `${days}d ago`;
  }
  return "Recently";
};

const formatSalary = (job) => {
  if (job?.salary?.trim()) return job.salary;
  if (job?.salaryMin != null && job?.salaryMax != null) {
    return `$${job.salaryMin.toLocaleString()} – $${job.salaryMax.toLocaleString()}`;
  }
  if (job?.salaryMin != null) return `From $${job.salaryMin.toLocaleString()}`;
  if (job?.salaryMax != null) return `Up to $${job.salaryMax.toLocaleString()}`;
  return "Not specified";
};

function JobDetailBody({ job, publicView, applied, saved, matchScore, onApply, onToggleSave }) {
  return (
    <>
      <Link to={publicView ? "/jobs" : "/candidate/jobs"} className="text-sm text-muted-foreground no-underline hover:text-foreground inline-flex items-center gap-1 mb-4 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to jobs
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <div className="rounded-2xl bg-card border border-border p-5 sm:p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center text-2xl overflow-hidden shrink-0">
                {job.companyLogo?.startsWith?.("http") ? (
                  <img src={job.companyLogo} alt={`${job.company || "Company"} logo`} className="w-full h-full object-cover" />
                ) : (
                  <Briefcase className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={job.type} />
                  {job.remote && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-success/20 text-foreground font-medium">Remote</span>
                  )}
                </div>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">{job.title}</h2>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm border-t border-border/40 pt-4">
              <Meta icon={MapPin} label="Location" value={job.location} />
              <Meta icon={Briefcase} label="Salary" value={formatSalary(job)} />
              <Meta icon={Clock} label="Posted" value={formatPostedAgo(job)} />
              <Meta icon={Users} label="Status" value={job.status || "Open"} />
            </div>
          </div>

          {job.description && (
            <Section title="About the role">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </Section>
          )}

          {job.responsibilities?.length > 0 && (
            <Section title="What you'll do">
              <ul className="space-y-2 text-sm p-0 list-none">
                {job.responsibilities.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-foreground">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {job.requirements?.length > 0 && (
            <Section title="Requirements">
              <ul className="space-y-2 text-sm p-0 list-none">
                {job.requirements.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-foreground">
                    <Check className="mt-0.5 w-4 h-4 text-primary flex-shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {job.skills?.length > 0 && (
            <Section title="Skills">
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-muted text-foreground font-medium">{s}</span>
                ))}
              </div>
            </Section>
          )}
        </div>

        <aside className="space-y-3">
          <div className="rounded-2xl bg-card border border-border p-5 lg:sticky lg:top-6 shadow-sm">
            {!publicView && matchScore !== null && (
              <>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Your match</div>
                <div className="text-4xl font-semibold tracking-tight text-primary">{matchScore}%</div>
                <p className="text-xs text-muted-foreground mt-1">Based on your skills & experience</p>
              </>
            )}
            {publicView && (
              <p className="text-sm text-muted-foreground mb-4">Sign in to see your match score and apply for this role.</p>
            )}
            <button
              type="button"
              onClick={onApply}
              disabled={!publicView && applied}
              className={`mt-2 w-full py-3 rounded-xl text-sm font-medium transition cursor-pointer active:scale-[0.98] border-none ${
                !publicView && applied ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {!publicView && applied ? "Applied ✓" : publicView ? "Sign in to apply" : "Apply now"}
            </button>
            <button
              type="button"
              onClick={onToggleSave}
              className="mt-2 w-full py-3 rounded-xl text-sm font-medium border border-border bg-card text-foreground hover:bg-muted transition cursor-pointer active:scale-[0.98] inline-flex items-center justify-center gap-2"
            >
              <BookmarkPlus className="w-4 h-4" />
              {publicView ? "Sign in to save" : saved ? "Saved" : "Save job"}
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}

function PublicJobLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 py-4 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 no-underline text-foreground min-w-0">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold truncate">Hireloop</span>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <ThemeToggle />
            <Link to="/jobs" className="text-xs sm:text-sm px-3 py-2 rounded-xl border border-border no-underline text-foreground hover:bg-muted whitespace-nowrap">All jobs</Link>
            <Link to="/login?role=candidate" className="text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl bg-primary text-primary-foreground no-underline hover:bg-primary/90 whitespace-nowrap">Sign in</Link>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-5 py-8 sm:py-10">{children}</main>
    </div>
  );
}

export default function CandidateJobDetail({ publicView = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [matchScore, setMatchScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const endpoint = publicView ? `/public/jobs/${id}` : `/candidate/jobs/${id}`;
        const res = await API.get(endpoint);
        setJob(res.data.job);
        if (!publicView) {
          setApplied(res.data.applied);
          setSaved(res.data.saved);
          setMatchScore(res.data.matchScore);
        }
      } catch (err) {
        console.error("Failed to load job details:", err);
        setJob(null);
        setError(err.response?.data?.message || "Failed to load job details");
        if (!publicView) toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJobDetail();
  }, [id, publicView]);

  const handleApply = async () => {
    if (publicView) {
      navigate("/login?role=candidate");
      return;
    }
    if (applied) return;
    try {
      await API.post(`/candidate/apply/${id}`);
      setApplied(true);
      toast.success("Application submitted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit application");
    }
  };

  const handleToggleSave = async () => {
    if (publicView) {
      navigate("/login?role=candidate");
      return;
    }
    try {
      const res = await API.post(`/candidate/saved/${id}`);
      setSaved(res.data.saved);
      toast.success(res.data.saved ? "Saved for later" : "Removed from saved");
    } catch (err) {
      toast.error("Failed to toggle save status");
    }
  };

  if (loading) {
    if (publicView) {
      return (
        <PublicJobLayout>
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading job...</div>
        </PublicJobLayout>
      );
    }
    return (
      <DashboardShell role="Candidate" nav={candidateNav} title="Job Details">
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading job details...</div>
      </DashboardShell>
    );
  }

  if (!job) {
    if (publicView) {
      return (
        <PublicJobLayout>
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <p className="text-muted-foreground">{error || "Job not found or no longer open."}</p>
            <Link to="/jobs" className="text-sm px-4 py-2 rounded-xl bg-primary text-primary-foreground no-underline">Back to jobs</Link>
          </div>
        </PublicJobLayout>
      );
    }
    return (
      <DashboardShell role="Candidate" nav={candidateNav} title="Job not found">
        <Link to="/candidate/jobs" className="text-sm text-primary no-underline hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to jobs
        </Link>
      </DashboardShell>
    );
  }

  const body = (
    <JobDetailBody
      job={job}
      publicView={publicView}
      applied={applied}
      saved={saved}
      matchScore={matchScore}
      onApply={handleApply}
      onToggleSave={handleToggleSave}
    />
  );

  if (publicView) {
    return <PublicJobLayout>{body}</PublicJobLayout>;
  }

  return (
    <DashboardShell role="Candidate" nav={candidateNav} title={job.title} subtitle={job.company}>
      {body}
    </DashboardShell>
  );
}

function Meta({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Icon className="w-3.5 h-3.5 shrink-0" />{label}</div>
      <div className="mt-1 text-sm font-medium text-foreground truncate">{value}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 sm:p-6 shadow-sm">
      <h3 className="text-sm font-semibold tracking-tight text-foreground mb-3">{title}</h3>
      {children}
    </div>
  );
}
