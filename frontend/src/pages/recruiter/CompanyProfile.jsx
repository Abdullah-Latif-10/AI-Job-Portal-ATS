import { DashboardShell } from "@/components/DashboardShell";
import { recruiterNav } from "@/lib/role-navs";

export default function CompanyProfile() {
  return (
    <DashboardShell role="Recruiter" nav={recruiterNav} title="Company profile" subtitle="How candidates see Northwind Labs.">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-card border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-accent/60 flex items-center justify-center text-3xl">🌊</div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold tracking-tight">Northwind Labs</h2>
                <p className="text-xs text-muted-foreground">SaaS · Analytics · Berlin, DE</p>
              </div>
              <button className="text-xs px-3 py-2 rounded-lg border border-border hover:bg-muted transition bg-transparent">Edit</button>
            </div>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              <Field label="Website" defaultValue="https://northwind.io" />
              <Field label="Founded" defaultValue="2018" />
              <Field label="Size" defaultValue="200–500" />
              <Field label="Industry" defaultValue="Analytics SaaS" />
            </div>
            <div className="mt-3">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">About</label>
              <textarea rows={4} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" defaultValue="Northwind builds the analytics platform trusted by 40,000+ teams to make sense of their product data." />
            </div>
          </div>
        </div>
        <aside className="space-y-3">
          <Stat label="Active jobs" value="8" />
          <Stat label="Total hires" value="42" />
          <Stat label="Avg time to hire" value="18 days" />
        </aside>
      </div>
    </DashboardShell>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function Field({ label, defaultValue }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
      <input defaultValue={defaultValue} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}