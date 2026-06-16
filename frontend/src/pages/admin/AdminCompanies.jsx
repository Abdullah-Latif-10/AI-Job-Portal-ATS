import { DashboardShell, StatusBadge } from "@/components/DashboardShell";
import { adminNav } from "@/lib/role-navs";
import { COMPANIES } from "@/lib/mock-data";
import { toast } from "@/components/ui/sonner";

export default function AdminCompanies() {
  return (
    <DashboardShell role="Admin" nav={adminNav} title="Companies" subtitle={`${COMPANIES.length} companies on the platform`}>
      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          <div className="col-span-4">Company</div>
          <div className="col-span-3">Industry</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-1">Jobs</div>
          <div className="col-span-2">Status</div>
        </div>
        <div className="divide-y divide-border">
          {COMPANIES.map((c) => (
            <div key={c.id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center text-sm">
              <div className="col-span-12 md:col-span-4 font-medium text-foreground">{c.name}</div>
              <div className="col-span-6 md:col-span-3 text-xs text-muted-foreground">{c.industry}</div>
              <div className="col-span-6 md:col-span-2 text-xs text-muted-foreground">{c.size}</div>
              <div className="col-span-6 md:col-span-1 text-xs tabular-nums text-muted-foreground">{c.jobs}</div>
              <div className="col-span-6 md:col-span-2 flex items-center gap-2">
                <StatusBadge status={c.status} />
                {c.status === "Pending" && (
                  <button
                    type="button"
                    onClick={() => toast.success(`${c.name} approved`)}
                    className="text-[11px] text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}