import { useState, useEffect } from "react";
import { DashboardShell, StatusBadge } from "@/components/DashboardShell";
import { adminNav } from "@/lib/role-navs";
import API from "@/api/axios";
import { toast } from "sonner";

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = () => {
    API.get("/admin/companies")
      .then((res) => {
        setCompanies(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load companies:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const updateCompanyStatus = async (id, status, name) => {
    try {
      await API.put(`/admin/companies/${id}/status`, { status });
      toast.success(`${name} status updated to ${status}`);
      // Refresh list to update badge state
      fetchCompanies();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update company status");
    }
  };

  if (loading) {
    return (
      <DashboardShell role="Admin" nav={adminNav} title="Companies" subtitle="Loading companies list...">
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Loading companies...
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Admin" nav={adminNav} title="Companies" subtitle={`${companies.length} companies on the platform`}>
      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          <div className="col-span-4">Company</div>
          <div className="col-span-3">Industry</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-1">Jobs</div>
          <div className="col-span-2">Status</div>
        </div>
        <div className="divide-y divide-border">
          {companies.map((c) => (
            <div key={c._id} className="flex flex-col gap-3 md:grid md:grid-cols-12 md:gap-4 px-4 sm:px-5 py-4 md:items-center text-sm">
              <div className="md:col-span-4 font-medium text-foreground">{c.name}</div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:contents">
                <div className="md:col-span-3 text-xs text-muted-foreground"><span className="md:hidden font-medium text-foreground/70 mr-1">Industry:</span>{c.industry || "General"}</div>
                <div className="md:col-span-2 text-xs text-muted-foreground"><span className="md:hidden font-medium text-foreground/70 mr-1">Size:</span>{c.size || "Unknown"}</div>
                <div className="md:col-span-1 text-xs tabular-nums text-muted-foreground"><span className="md:hidden font-medium text-foreground/70 mr-1">Jobs:</span>{c.jobs || 0}</div>
              </div>
              <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                <StatusBadge status={c.status} />
                {c.status !== "Approved" && (
                  <button
                    type="button"
                    onClick={() => updateCompanyStatus(c._id, "Approved", c.name)}
                    className="text-[11px] text-primary hover:underline bg-transparent border-none p-0 cursor-pointer text-left font-medium"
                  >
                    Approve
                  </button>
                )}
                {c.status === "Pending" && (
                  <button
                    type="button"
                    onClick={() => updateCompanyStatus(c._id, "Rejected", c.name)}
                    className="text-[11px] text-destructive hover:underline bg-transparent border-none p-0 cursor-pointer text-left font-medium"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
          {companies.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No companies found on the platform.
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}