import { DashboardShell, StatusBadge } from "@/components/DashboardShell";
import { candidateNav } from "@/lib/role-navs";
import { APPLICATIONS, JOBS } from "@/lib/mock-data";

export default function CandidateApplications() {
  const mine = APPLICATIONS.filter((a) => a.candidateEmail === "maya@example.com");

  return (
    <DashboardShell role="Candidate" nav={candidateNav} title="My applications" subtitle="Track every role you've applied to.">
      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          <div className="col-span-5">Role</div>
          <div className="col-span-2">Applied</div>
          <div className="col-span-2">Match</div>
          <div className="col-span-3">Status</div>
        </div>
        <div className="divide-y divide-border">
          {mine.map((a) => {
            const job = JOBS.find((j) => j.id === a.jobId);
            return (
              <div key={a.id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center text-sm">
                <div className="col-span-12 md:col-span-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-base flex-shrink-0">{job?.companyLogo || "💼"}</div>
                  <div className="min-w-0">
                    <div className="font-medium text-foreground truncate">{a.jobTitle}</div>
                    <div className="text-xs text-muted-foreground truncate">{a.company}</div>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-2 text-xs text-muted-foreground">{a.appliedAt}</div>
                <div className="col-span-4 md:col-span-2 tabular-nums text-xs text-foreground">{a.matchScore}%</div>
                <div className="col-span-4 md:col-span-3"><StatusBadge status={a.status} /></div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}