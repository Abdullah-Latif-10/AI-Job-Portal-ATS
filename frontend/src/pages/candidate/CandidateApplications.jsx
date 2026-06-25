import { useState, useEffect } from "react";
import { DashboardShell, StatusBadge } from "@/components/DashboardShell";
import { candidateNav } from "@/lib/role-navs";
import API from "@/api/axios";

export default function CandidateApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get("/candidate/applications");
        setApplications(res.data || []);
      } catch (err) {
        console.error("Failed to load applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <DashboardShell role="Candidate" nav={candidateNav} title="My applications" subtitle="Track every role you've applied to.">
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Loading applications...
        </div>
      ) : (
        <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
            <div className="col-span-5">Role</div>
            <div className="col-span-2">Applied</div>
            <div className="col-span-2">Match</div>
            <div className="col-span-3">Status</div>
          </div>
          <div className="divide-y divide-border">
            {applications.map((a) => {
              const job = a.jobId;
              return (
                <div key={a._id} className="flex flex-col gap-3 md:grid md:grid-cols-12 md:gap-4 px-4 sm:px-5 py-4 md:items-center text-sm">
                  <div className="md:col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-base flex-shrink-0 overflow-hidden">
                      {job?.companyLogo && job.companyLogo.startsWith("http") ? (
                        <img src={job.companyLogo} alt={`${job?.company || a.company || "Company"} logo`} className="w-full h-full object-cover" />
                      ) : (
                        <span aria-hidden="true">{job?.companyLogo || "💼"}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-foreground truncate">{job?.title || a.jobTitle}</div>
                      <div className="text-xs text-muted-foreground truncate">{job?.company || a.company}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:contents">
                    <div className="md:col-span-2 text-xs text-muted-foreground">
                      <span className="md:hidden font-medium text-foreground/70 mr-1">Applied:</span>
                      {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "Just now"}
                    </div>
                    <div className="md:col-span-2 tabular-nums text-xs text-foreground">
                      <span className="md:hidden font-medium text-foreground/70 mr-1">Match:</span>
                      {a.matchScore}%
                    </div>
                    <div className="md:col-span-3">
                      <StatusBadge status={a.status} />
                    </div>
                  </div>
                </div>
              );
            })}
            {applications.length === 0 && (
              <div className="p-12 text-center text-sm text-muted-foreground bg-card">
                You haven't applied to any jobs yet.
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}