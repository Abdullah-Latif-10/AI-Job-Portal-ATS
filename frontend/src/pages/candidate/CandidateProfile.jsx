import { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { candidateNav } from "@/lib/role-navs";
import { Upload, FileText, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";

const EXTRACTED_SKILLS = ["React", "TypeScript", "Node.js", "GraphQL", "PostgreSQL", "Tailwind", "Figma", "Jest"];
const SUMMARY = "Full-stack engineer with 5 years of experience shipping consumer-facing web products. Strong React/TypeScript foundation, comfortable across the stack, and a track record of mentoring junior engineers.";

export default function CandidateProfile() {
  const [resumeUploaded, setResumeUploaded] = useState(false);

  return (
    <DashboardShell role="Candidate" nav={candidateNav} title="Your profile" subtitle="Keep your details fresh so recruiters can find you.">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal info */}
          <Card title="Personal info">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Full name" defaultValue="Maya Iyer" />
              <Field label="Email" type="email" defaultValue="maya@example.com" />
              <Field label="Phone" defaultValue="+49 30 1234 5678" />
              <Field label="Location" defaultValue="Berlin, DE" />
            </div>
            <div className="mt-3">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Headline</label>
              <input className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" defaultValue="Senior Frontend Engineer · React, TypeScript" />
            </div>
          </Card>

          {/* Experience */}
          <Card title="Experience">
            <div className="space-y-3">
              {[
                { role: "Senior Frontend Engineer", company: "Acme Co.", period: "2023 — Present" },
                { role: "Frontend Engineer", company: "Helix", period: "2020 — 2023" },
                { role: "Junior Engineer", company: "BluePeak", period: "2019 — 2020" },
              ].map((e, i) => (
                <div key={i} className="rounded-xl bg-muted/40 p-4 flex items-start justify-between border border-border/40">
                  <div>
                    <div className="text-sm font-medium text-foreground">{e.role}</div>
                    <div className="text-xs text-muted-foreground">{e.company}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{e.period}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Education */}
          <Card title="Education">
            <div className="rounded-xl bg-muted/40 p-4 flex items-start justify-between border border-border/40">
              <div>
                <div className="text-sm font-medium text-foreground">B.S. Computer Science</div>
                <div className="text-xs text-muted-foreground">University of Munich</div>
              </div>
              <div className="text-xs text-muted-foreground">2015 — 2019</div>
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          {/* Resume */}
          <Card title="Resume">
            {!resumeUploaded ? (
              <button
                type="button"
                onClick={() => { setResumeUploaded(true); toast.success("Resume uploaded — AI analyzing..."); }}
                className="w-full border-2 border-dashed border-border bg-transparent rounded-xl py-8 px-4 hover:bg-muted/40 transition group cursor-pointer"
              >
                <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2 group-hover:text-primary transition" />
                <div className="text-sm font-medium text-foreground">Upload PDF</div>
                <div className="text-xs text-muted-foreground mt-1">Drag & drop or click to browse</div>
              </button>
            ) : (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">maya_iyer_resume.pdf</div>
                  <div className="text-xs text-muted-foreground">214 KB · uploaded just now</div>
                </div>
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              </div>
            )}
          </Card>

          {/* AI analysis */}
          <Card title={<span className="inline-flex items-center gap-2 text-foreground"><Sparkles className="w-4 h-4 text-primary" />AI summary</span>}>
            <p className="text-sm text-foreground leading-relaxed">{SUMMARY}</p>
            <div className="mt-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Extracted skills</div>
              <div className="flex flex-wrap gap-1.5">
                {EXTRACTED_SKILLS.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary font-medium">{s}</span>
                ))}
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </DashboardShell>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
      <h3 className="text-sm font-semibold tracking-tight text-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, defaultValue, type = "text" }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
      <input type={type} defaultValue={defaultValue} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}