import { useState } from "react";
import { Link, useParams } from "react-router-dom"; // Swapped to use standard react-router-dom params engine
import { DashboardShell, StatusBadge } from "@/components/DashboardShell";
import { candidateNav } from "@/lib/role-navs";
import { JOBS } from "@/lib/mock-data";
import { MapPin, Briefcase, Clock, Users, ArrowLeft, BookmarkPlus, Check } from "lucide-react";
import { toast } from "../../components/ui/sonner";

export default function CandidateJobDetail() {
  const { id } = useParams(); // Reading standard segment variable matches
  const job = JOBS.find((j) => j.id === id);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!job) {
    return (
      <DashboardShell role="Candidate" nav={candidateNav} title="Job not found">
        <Link to="/candidate/jobs" className="text-sm text-primary no-underline hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to jobs
        </Link>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Candidate" nav={candidateNav} title={job.title} subtitle={job.company}>
      <Link to="/candidate/jobs" className="text-sm text-muted-foreground no-underline hover:text-foreground inline-flex items-center gap-1 mb-4 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to jobs
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center text-2xl">{job.companyLogo}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={job.type} />
                  {job.remote && <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">Remote</span>}
                </div>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">{job.title}</h2>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm border-t border-border/40 pt-4">
              <Meta icon={MapPin} label="Location" value={job.location} />
              <Meta icon={Briefcase} label="Salary" value={job.salary} />
              <Meta icon={Clock} label="Posted" value={`${job.postedDays}d ago`} />
              <Meta icon={Users} label="Applicants" value={String(job.applicants)} />
            </div>
          </div>

          <Section title="About the role">
            <p className="text-sm text-foreground leading-relaxed">{job.description}</p>
          </Section>

          <Section title="What you'll do">
            <ul className="space-y-2 text-sm p-0 list-none">
              {job.responsibilities.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />{r}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Requirements">
            <ul className="space-y-2 text-sm p-0 list-none">
              {job.requirements.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-foreground">
                  <Check className="mt-0.5 w-4 h-4 text-primary flex-shrink-0" />{r}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-muted text-foreground font-medium">{s}</span>
              ))}
            </div>
          </Section>
        </div>

        <aside className="space-y-3">
          <div className="rounded-2xl bg-card border border-border p-5 sticky top-6 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Your match</div>
            <div className="text-4xl font-semibold tracking-tight text-primary">86%</div>
            <p className="text-xs text-muted-foreground mt-1">Based on your skills & experience</p>

            <button
              type="button"
              onClick={() => {
                if (applied) return;
                setApplied(true);
                toast.success("Application submitted!");
              }}
              disabled={applied}
              className={`mt-5 w-full py-3 rounded-xl text-sm font-medium transition cursor-pointer active:scale-[0.98] border-none ${
                applied ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {applied ? "Applied ✓" : "Apply now"}
            </button>
            <button
              type="button"
              onClick={() => { setSaved(!saved); toast.success(saved ? "Removed from saved" : "Saved for later"); }}
              className="mt-2 w-full py-3 rounded-xl text-sm font-medium border border-border bg-card text-foreground hover:bg-muted transition cursor-pointer active:scale-[0.98] inline-flex items-center justify-center gap-2"
            >
              <BookmarkPlus className="w-4 h-4" />
              {saved ? "Saved" : "Save job"}
            </button>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}

function Meta({ icon: Icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Icon className="w-3.5 h-3.5" />{label}</div>
      <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
      <h3 className="text-sm font-semibold tracking-tight text-foreground mb-3">{title}</h3>
      {children}
    </div>
  );
}