import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { DashboardShell, StatusBadge } from "@/components/DashboardShell";
import { recruiterNav } from "@/lib/role-navs";
import API from "@/api/axios";
import { Calendar, Clock, Video, MapPin, Phone, Pencil, Trash2, X, Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";

const modeIcon = {
  Video: Video,
  "On-site": MapPin,
  Phone: Phone
};

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingInterview, setEditingInterview] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("Video");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [interviewToCancel, setInterviewToCancel] = useState(null);

  const fetchInterviews = () => {
    API.get("/recruiter/interviews")
      .then((res) => {
        setInterviews(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch interviews:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  useEffect(() => {
    if (!editingInterview) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [editingInterview]);

  const openEditModal = (interview) => {
    setEditingInterview(interview);
    setDate(interview.date || "");
    setTime(interview.time || "");
    setMode(interview.mode || "Video");
    setNotes(interview.notes || "");
  };

  const closeEditModal = () => {
    setEditingInterview(null);
    setDate("");
    setTime("");
    setMode("Video");
    setNotes("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      toast.error("Please select a date and time");
      return;
    }

    setSaving(true);
    try {
      const res = await API.put(`/recruiter/interviews/${editingInterview._id}`, {
        date,
        time,
        mode,
        notes
      });
      setInterviews((prev) => prev.map((i) => (i._id === editingInterview._id ? res.data : i)));
      toast.success("Interview updated successfully");
      closeEditModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update interview");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelInterview = async () => {
    if (!interviewToCancel) return;

    setDeletingId(interviewToCancel._id);
    try {
      await API.delete(`/recruiter/interviews/${interviewToCancel._id}`);
      setInterviews((prev) => prev.filter((i) => i._id !== interviewToCancel._id));
      if (editingInterview?._id === interviewToCancel._id) {
        closeEditModal();
      }
      toast.success("Interview cancelled");
      setInterviewToCancel(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel interview");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardShell role="Recruiter" nav={recruiterNav} title="Interviews" subtitle="Loading schedule...">
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Loading interviews...
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Recruiter" nav={recruiterNav} title="Interviews" subtitle="Your upcoming scheduled meetings with candidates.">
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
                  <h3 className="text-sm font-semibold text-foreground">{i.candidateName}</h3>
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
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => openEditModal(i)}
                  className="inline-flex items-center justify-center text-xs p-2 rounded-lg border border-border hover:bg-muted transition bg-transparent cursor-pointer text-foreground"
                  title="Edit interview"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setInterviewToCancel(i)}
                  disabled={deletingId === i._id}
                  className="inline-flex items-center justify-center text-xs p-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition bg-transparent cursor-pointer disabled:opacity-50"
                  title="Cancel interview"
                >
                  {deletingId === i._id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
        {interviews.length === 0 && (
          <div className="rounded-2xl bg-card border border-border p-12 text-center text-sm text-muted-foreground">
            No upcoming interviews scheduled.
          </div>
        )}
      </div>

      {editingInterview &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 bg-foreground/20 backdrop-blur-sm"
            onClick={closeEditModal}
          >
            <div
              className="bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-border shadow-xl flex flex-col max-h-[92dvh] sm:max-h-[min(90vh,720px)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Edit Interview</h2>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="p-1.5 rounded-lg hover:bg-muted border-none bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>
              <div className="overflow-y-auto overscroll-contain flex-1 min-h-0 px-6 pb-6">
                <form className="space-y-4" onSubmit={handleUpdate}>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Candidate</label>
                    <div className="mt-1 text-sm font-semibold text-foreground">{editingInterview.candidateName}</div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Position</label>
                    <div className="mt-1 text-sm text-muted-foreground">{editingInterview.jobTitle}</div>
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
                    <label htmlFor="edit-interview-mode" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Interview Mode
                    </label>
                    <div className="relative mt-1.5">
                      <select
                        id="edit-interview-mode"
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
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Notes</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Preparation notes..."
                      className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition active:scale-[0.98] border-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setInterviewToCancel(editingInterview)}
                    disabled={saving || deletingId === editingInterview._id}
                    className="w-full py-3 rounded-xl text-sm font-medium border border-primary/30 text-primary hover:bg-primary/10 transition bg-transparent cursor-pointer flex items-center justify-center disabled:opacity-50"
                    title="Cancel interview"
                  >
                    {deletingId === editingInterview._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}

      <ConfirmDialog
        open={!!interviewToCancel}
        title="Cancel interview?"
        description={
          interviewToCancel
            ? `The scheduled interview with ${interviewToCancel.candidateName} for ${interviewToCancel.jobTitle} will be removed. The candidate will no longer see this meeting on their schedule.`
            : ""
        }
        confirmLabel="Cancel interview"
        cancelLabel="Keep interview"
        variant="destructive"
        loading={!!deletingId}
        onConfirm={handleCancelInterview}
        onCancel={() => !deletingId && setInterviewToCancel(null)}
      />
    </DashboardShell>
  );
}
