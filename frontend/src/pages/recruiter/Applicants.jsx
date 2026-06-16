import { useState } from "react";
import { DashboardShell, StatusBadge } from "@/components/DashboardShell";
import { recruiterNav } from "@/lib/role-navs";
import { APPLICATIONS } from "@/lib/mock-data";
import { Calendar, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const STATUSES = ["Applied", "Reviewed", "Shortlisted", "Rejected", "Hired"];

export default function Applicants() {
  const [apps, setApps] = useState(APPLICATIONS.filter((a) => a.company === "Northwind Labs"));
  const [filter, setFilter] = useState("All");

  const visible = filter === "All" ? apps : apps.filter((a) => a.status === filter);

  const updateStatus = (id, status) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    toast.success(`Status updated to ${status}`);
  };

  return (
    <DashboardShell role="Recruiter" nav={recruiterNav} title="Applicants" subtitle="Senior Frontend Engineer · Northwind Labs">
      <div className="flex items-center gap-2 flex-wrap mb-5">
        {["All", ...STATUSES].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${
              filter === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s} {s !== "All" && <span className="ml-1 opacity-70">{apps.filter((a) => a.status === s).length}</span>}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {visible.map((a) => (
          <div key={a.id} className="rounded-2xl bg-card border border-border p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
              {a.candidateName.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{a.candidateName}</div>
              <div className="text-xs text-muted-foreground truncate">{a.candidateEmail} · Applied {a.appliedAt}</div>
            </div>
            <div className="hidden sm:flex flex-col items-end">
              <div className="text-xs text-muted-foreground">AI match</div>
              <div className="text-base font-semibold text-primary tabular-nums">{a.matchScore}%</div>
            </div>
            <div className="relative">
              <details className="group">
                <summary className="list-none cursor-pointer inline-flex items-center gap-1.5">
                  <StatusBadge status={a.status} />
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </summary>
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-card border border-border shadow-lg p-1 z-10">
                  {STATUSES.map((s) => (
                    <button key={s} type="button" onClick={() => updateStatus(a.id, s)} className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-muted bg-transparent border-none">
                      {s}
                    </button>
                  ))}
                </div>
              </details>
            </div>
            <button
              type="button"
              onClick={() => toast.success("Interview scheduled — candidate notified")}
              className="hidden md:inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-border hover:bg-muted transition bg-transparent"
            >
              <Calendar className="w-3.5 h-3.5" /> Schedule
            </button>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="rounded-2xl bg-card border border-border p-12 text-center text-sm text-muted-foreground">No applicants in this stage.</div>
        )}
      </div>
    </DashboardShell>
  );
}