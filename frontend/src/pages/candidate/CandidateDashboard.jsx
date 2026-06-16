import { Link } from "react-router-dom";
import { DashboardShell, StatCard, StatusBadge } from "@/components/DashboardShell";
import { candidateNav } from "@/lib/role-navs";
import { APPLICATIONS, JOBS } from "@/lib/mock-data";
import { Briefcase, FileText, Sparkles, TrendingUp, ArrowRight, MapPin } from "lucide-react";

export default function CandidateDashboard() {
  const mine = APPLICATIONS.filter((a) => a.candidateEmail === "maya@example.com");
  const recommended = JOBS.slice(0, 3);

  return (
    <DashboardShell
      role="Candidate"
      nav={candidateNav}
      title="Good morning, Maya"
      subtitle="Here's what's moving on your applications."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="Applications" value={mine.length} icon={FileText} />
        <StatCard label="Shortlisted" value={mine.filter((a) => a.status === "Shortlisted").length} icon={Sparkles} />
        <StatCard label="Avg match" value="78%" icon={TrendingUp} />
        <StatCard label="Saved jobs" value={2} icon={Briefcase} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold tracking-tight text-foreground">Recent applications</h2>
            <Link to="/candidate/applications" className="text-xs text-primary no-underline hover:underline">View all</Link>
          </div>
          <div className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden shadow-sm">
            {mine.slice(0, 4).map((a) => (
              <div key={a.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-lg flex-shrink-0">
                  {JOBS.find((j) => j.id === a.jobId)?.companyLogo || "💼"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{a.jobTitle}</div>
                  <div className="text-xs text-muted-foreground truncate">{a.company} · {a.appliedAt}</div>
                </div>
                <div className="hidden sm:block text-xs text-muted-foreground tabular-nums">{a.matchScore}%</div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold tracking-tight text-foreground">Recommended for you</h2>
          </div>
          <div className="space-y-3">
            {recommended.map((j) => (
              <Link
                key={j.id}
                to={`/candidate/jobs/${j.id}`}
                className="block rounded-2xl bg-card border border-border p-4 hover:border-primary/40 no-underline transition group shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-lg flex-shrink-0">{j.companyLogo}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{j.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{j.company}</div>
                    <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {j.location}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}