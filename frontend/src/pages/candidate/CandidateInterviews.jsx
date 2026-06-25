import { useState, useEffect } from "react";
import { DashboardShell, StatusBadge } from "@/components/DashboardShell";
import { candidateNav } from "@/lib/role-navs";
import API from "@/api/axios";
import { Calendar, Clock, Video, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

const modeIcon = {
  Video: Video,
  "On-site": MapPin,
  Phone: Phone
};

export default function CandidateInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/candidate/interviews")
      .then((res) => {
        setInterviews(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch interviews:", err);
        toast.error("Failed to load interviews");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DashboardShell role="Candidate" nav={candidateNav} title="Interviews" subtitle="Loading your schedule...">
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Loading interviews...
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Candidate" nav={candidateNav} title="Interviews" subtitle="Your upcoming scheduled interviews with recruiters.">
      <div className="space-y-3">
        {interviews.map((i) => {
          const Icon = modeIcon[i.mode] || Video;
          return (
            <div key={i._id} className="rounded-2xl bg-card border border-border p-5 flex items-start gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-accent/60 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-foreground">{i.jobTitle}</h3>
                  <StatusBadge status={i.mode} />
                </div>
                <div className="text-xs text-muted-foreground">{i.company}</div>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{i.date}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{i.time}</span>
                  <span className="inline-flex items-center gap-1"><Icon className="w-3 h-3" />{i.mode}</span>
                </div>
                {i.notes && <p className="mt-2 text-xs text-foreground/80 italic">"{i.notes}"</p>}
              </div>
            </div>
          );
        })}
        {interviews.length === 0 && (
          <div className="rounded-2xl bg-card border border-border p-12 text-center text-sm text-muted-foreground">
            No upcoming interviews scheduled yet.
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
