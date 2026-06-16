import { useState } from "react";
import { DashboardShell, StatusBadge } from "@/components/DashboardShell";
import { recruiterNav } from "@/lib/role-navs";
import { JOBS } from "@/lib/mock-data";
import { Plus, Users, X } from "lucide-react";
import { toast } from "sonner";

export default function RecruiterJobs() {
  const [open, setOpen] = useState(false);

  return (
    <DashboardShell
      role="Recruiter"
      nav={recruiterNav}
      title="Jobs"
      subtitle="Manage your open and draft roles."
      action={
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition active:scale-[0.97]">
          <Plus className="w-4 h-4" /> Post a job
        </button>
      }
    >
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          <div className="col-span-5">Title</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Applicants</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1" />
        </div>
        <div className="divide-y divide-border">
          {JOBS.map((j) => (
            <div key={j.id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center text-sm">
              <div className="col-span-12 md:col-span-5">
                <div className="font-medium">{j.title}</div>
                <div className="text-xs text-muted-foreground">{j.location} · {j.salary}</div>
              </div>
              <div className="col-span-4 md:col-span-2"><StatusBadge status={j.type} /></div>
              <div className="col-span-4 md:col-span-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" /> {j.applicants}
              </div>
              <div className="col-span-4 md:col-span-2"><StatusBadge status={j.status} /></div>
              <div className="col-span-12 md:col-span-1 text-right">
                <button className="text-xs text-primary hover:underline bg-transparent border-none p-0 cursor-pointer">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6 animate-fade-up-blur" onClick={() => setOpen(false)}>
          <div className="bg-card w-full md:max-w-lg rounded-t-3xl md:rounded-3xl border border-border p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold tracking-tight">Post a new job</h2>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setOpen(false); toast.success("Job posted!"); }}>
              <Input label="Job title" placeholder="Senior Frontend Engineer" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Location" placeholder="Berlin, DE" />
                <Input label="Salary range" placeholder="€80k – €110k" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select label="Type" options={["Full-time", "Part-time", "Contract", "Internship"]} />
                <Select label="Status" options={["Open", "Draft"]} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</label>
                <textarea rows={4} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="What will the role involve?" />
              </div>
              <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition active:scale-[0.98]">
                Publish job
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
      <input {...props} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}

function Select({ label, options }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
      <select className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}