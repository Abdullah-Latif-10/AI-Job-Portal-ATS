import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Briefcase, ChevronLeft, ChevronRight, Leaf } from "lucide-react";
import API from "@/api/axios";
import { StatusBadge } from "@/components/DashboardShell";
import ThemeToggle from "@/components/ThemeToggle";

const TYPES = ["All", "Full-time", "Part-time", "Contract", "Internship"];

export default function PublicJobs() {
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
        const res = await API.get("/public/jobs", {
          params: { q, type, remote, salaryMin, salaryMax, page, limit: 8 }
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
    const t = setTimeout(fetchJobs, 250);
    return () => clearTimeout(t);
  }, [q, type, remote, salaryMin, salaryMax, page]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 py-4 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 no-underline text-foreground min-w-0">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold truncate">Hireloop</span>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <ThemeToggle />
            <Link to="/login" className="text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl border border-border no-underline text-foreground hover:bg-muted whitespace-nowrap">Sign in</Link>
            <Link to="/signup" className="text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl bg-primary text-primary-foreground no-underline hover:bg-primary/90 whitespace-nowrap">Sign up</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-5 py-8 sm:py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Open positions</h1>
        <p className="text-sm text-muted-foreground mt-1">{totalCount} roles available</p>

        <div className="rounded-2xl bg-card border border-border p-4 mt-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 rounded-xl bg-background border border-input px-3.5 py-2.5">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              className="flex-1 bg-transparent text-sm text-foreground outline-none border-none p-0"
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
                  type === t ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground"
                }`}
              >
                {t}
              </button>
            ))}
            <label className="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
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

        {loading ? (
          <div className="text-center py-20 text-muted-foreground text-sm">Loading jobs...</div>
        ) : (
          <div className="space-y-3">
            {jobs.map((j) => (
              <Link key={j._id} to={`/jobs/${j._id}`} className="block rounded-2xl bg-card border border-border p-5 hover:border-primary/40 no-underline text-foreground transition shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
                    {j.companyLogo && j.companyLogo.startsWith('http') ? (
                      <img src={j.companyLogo} alt={`${j.company || "Company"} logo`} className="w-full h-full object-cover" />
                    ) : (
                      <Briefcase className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold">{j.title}</h3>
                      <StatusBadge status={j.type} />
                    </div>
                    <div className="text-sm text-muted-foreground">{j.company}</div>
                    <div className="mt-2 flex gap-4 text-xs text-muted-foreground flex-wrap">
                      <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{j.location}</span>
                      <span>{j.salary || "Salary not specified"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {jobs.length === 0 && (
              <div className="rounded-2xl bg-card border border-border p-12 text-center text-sm text-muted-foreground">No jobs match your filters.</div>
            )}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-border disabled:opacity-40 cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
            <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-border disabled:opacity-40 cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
