import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { DashboardShell, StatusBadge } from "@/components/DashboardShell";
import { recruiterNav } from "@/lib/role-navs";
import API from "@/api/axios";
import { Calendar, ChevronDown, X, Loader2, User, Download, Briefcase, GraduationCap } from "lucide-react";
import { toast } from "sonner";

const STATUSES = ["Applied", "Reviewed", "Shortlisted", "Rejected", "Hired"];

export default function Applicants() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const [selectedApp, setSelectedApp] = useState(null);
  const [profileApp, setProfileApp] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("Video");
  const [notes, setNotes] = useState("");
  const [scheduling, setScheduling] = useState(false);

  const fetchApplicants = () => {
    API.get("/recruiter/applicants")
      .then((res) => {
        setApps(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load applicants:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    if (!selectedApp && !profileApp) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedApp, profileApp]);

  const visible = filter === "All" ? apps : apps.filter((a) => a.status === filter);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/recruiter/applicants/${id}/status`, { status });
      setApps((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      toast.error("Please select a date and time");
      return;
    }

    setScheduling(true);
    try {
      await API.post("/recruiter/interviews/schedule", {
        candidateId: selectedApp.candidateId,
        jobId: selectedApp.jobId?._id || selectedApp.jobId,
        date,
        time,
        mode,
        notes
      });

      toast.success(`Interview scheduled with ${selectedApp.candidateName}`);
      setSelectedApp(null);
      setDate("");
      setTime("");
      setMode("Video");
      setNotes("");
      fetchApplicants();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to schedule interview");
    } finally {
      setScheduling(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell role="Recruiter" nav={recruiterNav} title="Applicants" subtitle="Loading applicant profiles...">
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Loading applicants...
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Recruiter" nav={recruiterNav} title="Applicants" subtitle="Manage candidates who applied to your job postings.">
      <div className="flex items-center gap-2 flex-wrap mb-5">
        {["All", ...STATUSES].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition cursor-pointer ${
              filter === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s} {s !== "All" && <span className="ml-1 opacity-70">{apps.filter((a) => a.status === s).length}</span>}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {visible.map((a) => (
          <div key={a._id} className="rounded-2xl bg-card border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
              {(a.candidateName || "C").split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{a.candidateName}</div>
              <div className="text-xs text-muted-foreground truncate">
                {a.candidateEmail} · Applied for <span className="font-medium text-foreground">{a.jobId?.title || "Role"}</span>
              </div>
            </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:shrink-0 w-full sm:w-auto">
            <div className="sm:flex flex-col items-end hidden">
              <div className="text-xs text-muted-foreground">AI match</div>
              <div className="text-base font-semibold text-primary tabular-nums">{a.matchScore}%</div>
            </div>
            <span className="sm:hidden text-xs font-semibold text-primary tabular-nums">{a.matchScore}% match</span>
            <button
              type="button"
              onClick={() => setProfileApp(a)}
              className="inline-flex items-center justify-center p-2 sm:px-3 sm:py-2 rounded-lg border border-border hover:bg-muted transition bg-transparent cursor-pointer text-foreground"
              title="View profile"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline sm:ml-1.5 text-xs">View Profile</span>
            </button>
            <div className="relative">
              <details className="group">
                <summary className="list-none cursor-pointer inline-flex items-center gap-1.5 select-none">
                  <StatusBadge status={a.status} />
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </summary>
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-card border border-border shadow-lg p-1 z-10">
                  {STATUSES.map((s) => (
                    <button key={s} type="button" onClick={() => updateStatus(a._id, s)} className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-muted bg-transparent border-none cursor-pointer text-foreground">
                      {s}
                    </button>
                  ))}
                </div>
              </details>
            </div>
            <button
              type="button"
              onClick={() => setSelectedApp(a)}
              className="inline-flex items-center justify-center p-2 sm:px-3 sm:py-2 rounded-lg border border-border hover:bg-muted transition bg-transparent cursor-pointer text-foreground"
              title="Schedule interview"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline sm:ml-1.5 text-xs">Schedule</span>
            </button>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="rounded-2xl bg-card border border-border p-12 text-center text-sm text-muted-foreground">
            No applicants in this stage.
          </div>
        )}
      </div>

      {profileApp &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setProfileApp(null)}
          >
            <div
              className="bg-card w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl border border-border shadow-xl flex flex-col max-h-[92dvh] sm:max-h-[min(90vh,820px)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0 border-b border-border">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">{profileApp.candidateName}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Applied for {profileApp.jobId?.title || "Role"} · {profileApp.matchScore}% match
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileApp(null)}
                  className="p-1.5 rounded-lg hover:bg-muted border-none bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>

              <div className="overflow-y-auto overscroll-contain flex-1 min-h-0 px-6 py-5 space-y-6">
                {profileApp.candidateProfile ? (
                  <>
                    <ProfileSection title="Contact & Summary">
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        {profileApp.candidateProfile.phone && (
                          <InfoRow label="Phone" value={profileApp.candidateProfile.phone} />
                        )}
                        {profileApp.candidateProfile.location && (
                          <InfoRow label="Location" value={profileApp.candidateProfile.location} />
                        )}
                      </div>
                      {profileApp.candidateProfile.headline && (
                        <p className="text-sm font-medium text-foreground mt-3">{profileApp.candidateProfile.headline}</p>
                      )}
                      {profileApp.candidateProfile.summary && (
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{profileApp.candidateProfile.summary}</p>
                      )}
                    </ProfileSection>

                    {profileApp.candidateProfile.skills?.length > 0 && (
                      <ProfileSection title="Skills">
                        <div className="flex flex-wrap gap-1.5">
                          {profileApp.candidateProfile.skills.map((skill) => (
                            <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </ProfileSection>
                    )}

                    {profileApp.candidateProfile.experience?.length > 0 && (
                      <ProfileSection title="Work Experience" icon={Briefcase}>
                        <div className="space-y-4">
                          {profileApp.candidateProfile.experience.map((exp, i) => (
                            <div key={i} className="relative pl-4 border-l-2 border-primary/20">
                              <div className="text-sm font-medium text-foreground">{exp.role}</div>
                              <div className="text-xs text-muted-foreground">{exp.company} · {exp.period}</div>
                            </div>
                          ))}
                        </div>
                      </ProfileSection>
                    )}

                    {profileApp.candidateProfile.education?.length > 0 && (
                      <ProfileSection title="Education" icon={GraduationCap}>
                        <div className="space-y-4">
                          {profileApp.candidateProfile.education.map((edu, i) => (
                            <div key={i} className="relative pl-4 border-l-2 border-primary/20">
                              <div className="text-sm font-medium text-foreground">{edu.degree}</div>
                              <div className="text-xs text-muted-foreground">{edu.school} · {edu.period}</div>
                            </div>
                          ))}
                        </div>
                      </ProfileSection>
                    )}

                    {profileApp.candidateProfile.resume?.url && (
                      <ProfileSection title="Resume / CV">
                        <a
                          href={profileApp.candidateProfile.resume.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium"
                        >
                          <Download className="w-4 h-4" />
                          {profileApp.candidateProfile.resume.filename || "Download Resume"}
                        </a>
                      </ProfileSection>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No profile details available for this candidate yet.
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {selectedApp &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setSelectedApp(null)}
          >
            <div
              className="bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-border shadow-xl flex flex-col max-h-[92dvh] sm:max-h-[min(90vh,720px)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Schedule Interview</h2>
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 rounded-lg hover:bg-muted border-none bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>
              <div className="overflow-y-auto overscroll-contain flex-1 min-h-0 px-6 pb-6">
                <form className="space-y-4" onSubmit={handleScheduleSubmit}>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Candidate</label>
                    <div className="mt-1 text-sm font-semibold text-foreground">{selectedApp.candidateName}</div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">For Position</label>
                    <div className="mt-1 text-sm text-muted-foreground">{selectedApp.jobId?.title || "Role"}</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      />
                    </div>
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</label>
                      <input
                        type="time"
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="interview-mode" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Interview Mode
                    </label>
                    <div className="relative mt-1.5">
                      <select
                        id="interview-mode"
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-input bg-background px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground cursor-pointer"
                      >
                        <option value="Video">Video Call</option>
                        <option value="On-site">On-site</option>
                        <option value="Phone">Phone Interview</option>
                      </select>
                      <ChevronDown
                        aria-hidden
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preparation Notes</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Bring copy of resume, portfolio review details..."
                      className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={scheduling}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition active:scale-[0.98] border-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    {scheduling ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Scheduling...
                      </>
                    ) : (
                      "Confirm & Schedule"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}
    </DashboardShell>
  );
}

function ProfileSection({ title, icon: Icon, children }) {
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {title}
      </h3>
      {children}
    </section>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground mt-0.5">{value}</div>
    </div>
  );
}
