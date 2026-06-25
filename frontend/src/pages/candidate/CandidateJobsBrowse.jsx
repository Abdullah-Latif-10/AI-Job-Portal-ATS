import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardShell, StatusBadge } from "@/components/DashboardShell";
import { candidateNav } from "@/lib/role-navs";
import { Search, MapPin, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import API from "@/api/axios";

const TYPES = ["All", "Full-time", "Part-time", "Contract", "Internship"];

export default function CandidateJobsBrowse() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [remote, setRemote] = useState(false);
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await API.get("/candidate/jobs", {
          params: {
            q,
            type,
            remote,
            salaryMin,
            salaryMax,
            page,
            limit: 4
          }
        });
        setJobs(res.data.jobs || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.totalCount || 0);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    // Simple debounce for search input query to avoid over-calling the API
    const delayDebounce = setTimeout(() => {
      fetchJobs();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [q, type, remote, salaryMin, salaryMax, page]);

  return (
    <DashboardShell role="Candidate" nav={candidateNav} title="Find your next role" subtitle={`${totalCount} open roles match your filters`}>
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
          <label className="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
            <input type="checkbox" checked={remote} onChange={(e) => { setRemote(e.target.checked); setPage(1); }} className="rounded accent-primary" />
            Remote only
          </label>
        </div>
        <div className="mt-3 grid sm:grid-cols-2 gap-3">
          <input
            type="number"
            value={salaryMin}
            onChange={(e) => { setSalaryMin(e.target.value); setPage(1); }}
            placeholder="Min salary (e.g. 50000)"
            className="rounded-xl border border-input bg-background px-4 py-2 text-sm text-foreground"
          />
          <input
            type="number"
            value={salaryMax}
            onChange={(e) => { setSalaryMax(e.target.value); setPage(1); }}
            placeholder="Max salary (e.g. 120000)"
            className="rounded-xl border border-input bg-background px-4 py-2 text-sm text-foreground"
          />
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Loading jobs...
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((j) => (
            <Link
              key={j._id}
              to={`/candidate/jobs/${j._id}`}
              className="block rounded-2xl bg-card border border-border p-5 hover:border-primary/40 no-underline text-foreground transition group shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
                  {j.companyLogo && j.companyLogo.startsWith("http") ? (
                    <img src={j.companyLogo} alt={`${j.company || "Company"} logo`} className="w-full h-full object-cover" />
                  ) : (
                    <span aria-hidden="true">{j.companyLogo || "💼"}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold tracking-tight text-foreground">{j.title}</h3>
                    <StatusBadge status={j.type} />
                    {j.remote && <span className="text-[11px] px-2 py-0.5 rounded-full bg-success/20 text-foreground font-medium border border-success/30">Remote</span>}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{j.company}</div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{j.location}</span>
                    <span className="inline-flex items-center gap-1"><Briefcase className="w-3 h-3" />{j.salary}</span>
                    <span>Posted {j.postedDays}d ago</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    {j.skills?.slice(0, 4).map((s) => (
                      <span key={s} className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {jobs.length === 0 && (
            <div className="rounded-2xl bg-card border border-border p-12 text-center text-sm text-muted-foreground shadow-sm">
              No jobs match your filters.
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
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