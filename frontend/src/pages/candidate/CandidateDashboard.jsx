import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardShell, StatCard, StatusBadge } from "@/components/DashboardShell";
import { candidateNav } from "@/lib/role-navs";
import API from "@/api/axios";
import { Briefcase, FileText, Sparkles, TrendingUp, ArrowRight, MapPin } from "lucide-react";

export default function CandidateDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/candidate/dashboard-stats")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DashboardShell role="Candidate" nav={candidateNav} title="Good morning" subtitle="Loading dashboard summary...">
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Loading dashboard summary...
        </div>
      </DashboardShell>
    );
  }

  const { firstName, stats, recentApplications = [], recommendedJobs = [] } = data || {};

  return (
    <DashboardShell
      role="Candidate"
      nav={candidateNav}
      title={`Good morning, ${firstName || "Candidate"}`}
      subtitle="Here's what's moving on your applications."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="Applications" value={stats?.applicationsCount || 0} icon={FileText} />
        <StatCard label="Shortlisted" value={stats?.shortlistedCount || 0} icon={Sparkles} />
        <StatCard label="Avg match" value={stats?.avgMatchScore || "0%"} icon={TrendingUp} />
        <StatCard label="Saved jobs" value={stats?.savedCount || 0} icon={Briefcase} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold tracking-tight text-foreground">Recent applications</h2>
            <Link to="/candidate/applications" className="text-xs text-primary no-underline hover:underline">View all</Link>
          </div>
          <div className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden shadow-sm">
            {recentApplications.map((a) => (
              <div key={a._id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                  {a.jobId?.companyLogo && a.jobId.companyLogo.startsWith("http") ? (
                    <img src={a.jobId.companyLogo} alt={`${a.jobId?.company || a.company || "Company"} logo`} className="w-full h-full object-cover" />
                  ) : (
                    <span aria-hidden="true">{a.jobId?.companyLogo || "💼"}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{a.jobId?.title || a.jobTitle}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {a.jobId?.company || a.company} · {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "Just now"}
                  </div>
                </div>
                <div className="hidden sm:block text-xs text-muted-foreground tabular-nums">{a.matchScore}%</div>
                <StatusBadge status={a.status} />
              </div>
            ))}
            {recentApplications.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No recent applications found.
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold tracking-tight text-foreground">Recommended for you</h2>
          </div>
          <div className="space-y-3">
            {recommendedJobs.map((j) => (
              <Link
                key={j._id}
                to={`/candidate/jobs/${j._id}`}
                className="block rounded-2xl bg-card border border-border p-4 hover:border-primary/40 no-underline transition group shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                    {j.companyLogo && j.companyLogo.startsWith("http") ? (
                      <img src={j.companyLogo} alt={`${j.company || "Company"} logo`} className="w-full h-full object-cover" />
                    ) : (
                      <span aria-hidden="true">{j.companyLogo || "💼"}</span>
                    )}
                  </div>
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
            {recommendedJobs.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground bg-card border border-border rounded-2xl">
                No recommendations available.
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}