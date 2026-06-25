import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardShell, StatCard, StatusBadge } from "@/components/DashboardShell";
import { recruiterNav } from "@/lib/role-navs";
import API from "@/api/axios";
import { Briefcase, Users, Calendar, TrendingUp, ArrowRight } from "lucide-react";

export default function RecruiterHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/recruiter/dashboard-stats")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load recruiter dashboard data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DashboardShell role="Recruiter" nav={recruiterNav} title="Welcome back" subtitle="Loading your dashboard summary...">
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Loading dashboard summary...
        </div>
      </DashboardShell>
    );
  }

  const { stats = {}, recentApplicants = [], upcomingInterviews = [] } = data || {};

  return (
    <DashboardShell
      role="Recruiter"
      nav={recruiterNav}
      title="Welcome back, Recruiter"
      subtitle="Manage your candidates, schedules, and job openings."
      action={
        <Link to="/recruiter/jobs" className="hidden md:inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition active:scale-[0.97] no-underline">
          Post a job <ArrowRight className="w-4 h-4" />
        </Link>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="Open jobs" value={stats.openJobsCount || 0} icon={Briefcase} />
        <StatCard label="New applicants" value={stats.newApplicantsCount || 0} icon={Users} hint="status: Applied" />
        <StatCard label="Interviews" value={stats.upcomingInterviewsCount || 0} icon={Calendar} hint="upcoming scheduled" />
        <StatCard label="Hire rate" value={stats.hireRate || "0%"} icon={TrendingUp} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold tracking-tight">Recent applicants</h2>
            <Link to="/recruiter/applicants" className="text-xs text-primary hover:underline no-underline">View all</Link>
          </div>
          <div className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
            {recentApplicants.map((a) => (
              <div key={a._id} className="p-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {a.candidateName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.candidateName}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {a.jobId?.title || "Role"} · {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "Just now"}
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs">
                  <span className="text-muted-foreground">Match</span>
                  <span className="font-semibold text-primary tabular-nums">{a.matchScore}%</span>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
            {recentApplicants.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No recent applicants.
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold tracking-tight mb-3">Upcoming interviews</h2>
          <div className="space-y-3">
            {upcomingInterviews.map((i) => (
              <div key={i._id} className="rounded-2xl bg-card border border-border p-4">
                <div className="text-xs text-muted-foreground">{i.date} · {i.time}</div>
                <div className="mt-1 text-sm font-medium">{i.candidateName}</div>
                <div className="text-xs text-muted-foreground">{i.jobTitle}</div>
                <div className="mt-2">
                  <StatusBadge status={i.mode} />
                </div>
              </div>
            ))}
            {upcomingInterviews.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground bg-card border border-border rounded-2xl">
                No upcoming interviews.
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}