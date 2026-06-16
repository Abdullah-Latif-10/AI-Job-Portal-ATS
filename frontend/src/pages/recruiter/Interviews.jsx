import { DashboardShell, StatusBadge } from "@/components/DashboardShell";
import { recruiterNav } from "@/lib/role-navs";
import { INTERVIEWS } from "@/lib/mock-data";
import { Calendar, Clock, Video, MapPin, Phone } from "lucide-react";

const modeIcon = { 
  Video: Video, 
  "On-site": MapPin, 
  Phone: Phone 
};

export default function Interviews() {
  return (
    <DashboardShell role="Recruiter" nav={recruiterNav} title="Interviews" subtitle="Your upcoming schedule.">
      <div className="space-y-3">
        {INTERVIEWS.map((i) => {
          const Icon = modeIcon[i.mode] || Video;
          return (
            <div key={i.id} className="rounded-2xl bg-card border border-border p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/60 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold">{i.candidateName}</h3>
                  <StatusBadge status={i.mode} />
                </div>
                <div className="text-xs text-muted-foreground">{i.jobTitle} · {i.company}</div>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{i.date}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{i.time}</span>
                  <span className="inline-flex items-center gap-1"><Icon className="w-3 h-3" />{i.mode}</span>
                </div>
                {i.notes && <p className="mt-2 text-xs text-foreground/80 italic">"{i.notes}"</p>}
              </div>
              <button className="hidden md:inline-flex text-xs px-3 py-2 rounded-lg border border-border hover:bg-muted transition bg-transparent">Reschedule</button>
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
}