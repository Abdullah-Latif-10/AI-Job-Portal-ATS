import { Link } from "react-router-dom";
import { DashboardShell } from "@/components/DashboardShell";
import { candidateNav } from "@/lib/role-navs";
import { JOBS, SAVED_JOBS } from "@/lib/mock-data";
import { MapPin, ArrowRight, Bookmark } from "lucide-react";

export default function CandidateSavedJobs() {
  const jobs = JOBS.filter((j) => SAVED_JOBS.includes(j.id));
  return (
    <DashboardShell role="Candidate" nav={candidateNav} title="Saved jobs" subtitle="Roles you're keeping an eye on.">
      {jobs.length === 0 ? (
        <div className="rounded-2xl bg-card border border-border p-12 text-center shadow-sm">
          <Bookmark className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No saved jobs yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {jobs.map((j) => (
            <Link
              key={j.id}
              to={`/candidate/jobs/${j.id}`}
              className="rounded-2xl bg-card border border-border p-5 hover:border-primary/40 no-underline transition text-foreground group shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center text-xl">{j.companyLogo}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate text-foreground">{j.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{j.company}</div>
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="w-3 h-3" />{j.location} · {j.salary}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}