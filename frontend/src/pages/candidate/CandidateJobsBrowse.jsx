import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardShell, StatusBadge } from "@/components/DashboardShell";
import { candidateNav } from "@/lib/role-navs";
import { JOBS } from "@/lib/mock-data";
import { Search, MapPin, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";

const TYPES = ["All", "Full-time", "Part-time", "Contract", "Internship"];

export default function CandidateJobsBrowse() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [remote, setRemote] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 4;

  const filtered = JOBS.filter((j) => {
    if (q && !(`${j.title} ${j.company} ${j.skills.join(" ")}`.toLowerCase().includes(q.toLowerCase()))) return false;
    if (type !== "All" && j.type !== type) return false;
    if (remote && !j.remote) return false;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const visible = filtered.slice(start, start + perPage);

  return (
    <DashboardShell role="Candidate" nav={candidateNav} title="Find your next role" subtitle={`${filtered.length} open roles match your filters`}>
      {/* Search + filters */}
      <div className="rounded-2xl bg-card border border-border p-4 mb-6 shadow-sm">
        <div className="flex items-center gap-2 rounded-xl bg-background border border-input px-3.5 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground border-none p-0"
            placeholder="Search by title, company, or skill"
          />
        </div>
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setType(t); setPage(1); }}
              className={`text-xs px-3 py-1.5 rounded-full border transition cursor-pointer ${
                type === t ? "bg-primary text-primary-foreground border-primary font-medium" : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
          <label className="ml-auto inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
            <input type="checkbox" checked={remote} onChange={(e) => { setRemote(e.target.checked); setPage(1); }} className="rounded accent-primary" />
            Remote only
          </label>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {visible.map((j) => (
          <Link
            key={j.id}
            to={`/candidate/jobs/${j.id}`}
            className="block rounded-2xl bg-card border border-border p-5 hover:border-primary/40 no-underline text-foreground transition group shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-xl flex-shrink-0">{j.companyLogo}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">{j.title}</h3>
                  <StatusBadge status={j.type} />
                  {j.remote && <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium border border-emerald-500/10">Remote</span>}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{j.company}</div>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{j.location}</span>
                  <span className="inline-flex items-center gap-1"><Briefcase className="w-3 h-3" />{j.salary}</span>
                  <span>Posted {j.postedDays}d ago</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  {j.skills.slice(0, 4).map((s) => (
                    <span key={s} className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
        {visible.length === 0 && (
          <div className="rounded-2xl bg-card border border-border p-12 text-center text-sm text-muted-foreground shadow-sm">
            No jobs match your filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-border bg-card text-foreground disabled:opacity-40 hover:bg-muted transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-muted-foreground tabular-nums">Page {page} of {totalPages}</span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-border bg-card text-foreground disabled:opacity-40 hover:bg-muted transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </DashboardShell>
  );
}