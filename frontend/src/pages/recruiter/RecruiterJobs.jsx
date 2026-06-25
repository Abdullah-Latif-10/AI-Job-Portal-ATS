import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { DashboardShell, StatusBadge } from "@/components/DashboardShell";
import { recruiterNav } from "@/lib/role-navs";
import API from "@/api/axios";
import { Plus, Users, X, Loader2, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";

const inputClassName =
  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground";

const selectClassName =
  "w-full appearance-none rounded-xl border border-input bg-background px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground cursor-pointer";

function FormSelect({ id, label, value, onChange, children }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <div className="relative mt-1.5">
        <select id={id} value={value} onChange={onChange} className={selectClassName}>
          {children}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
        />
      </div>
    </div>
  );
}

const emptyForm = {
  title: "",
  location: "",
  salary: "",
  salaryMin: "",
  salaryMax: "",
  type: "Full-time",
  status: "Open",
  description: "",
  skills: "",
  remote: false,
  responsibilities: "",
  requirements: ""
};

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [type, setType] = useState("Full-time");
  const [status, setStatus] = useState("Open");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [remote, setRemote] = useState(false);
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");

  const fetchJobs = () => {
    API.get("/recruiter/jobs")
      .then((res) => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load recruiter jobs:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const resetForm = () => {
    setTitle(emptyForm.title);
    setLocation(emptyForm.location);
    setSalary(emptyForm.salary);
    setSalaryMin(emptyForm.salaryMin);
    setSalaryMax(emptyForm.salaryMax);
    setType(emptyForm.type);
    setStatus(emptyForm.status);
    setDescription(emptyForm.description);
    setSkills(emptyForm.skills);
    setRemote(emptyForm.remote);
    setResponsibilities(emptyForm.responsibilities);
    setRequirements(emptyForm.requirements);
    setEditingJob(null);
  };

  const openCreateModal = () => {
    resetForm();
    setOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setTitle(job.title || "");
    setLocation(job.location || "");
    setSalary(job.salary || "");
    setSalaryMin(job.salaryMin ?? "");
    setSalaryMax(job.salaryMax ?? "");
    setType(job.type || "Full-time");
    setStatus(job.status || "Open");
    setDescription(job.description || "");
    setSkills(Array.isArray(job.skills) ? job.skills.join(", ") : "");
    setRemote(!!job.remote);
    setResponsibilities(Array.isArray(job.responsibilities) ? job.responsibilities.join("\n") : "");
    setRequirements(Array.isArray(job.requirements) ? job.requirements.join("\n") : "");
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !location) {
      toast.error("Please fill in the job title and location.");
      return;
    }

    const payload = {
      title,
      location,
      salary,
      salaryMin,
      salaryMax,
      type,
      status,
      description,
      skills: skills ? skills.split(",").map((s) => s.trim()) : [],
      remote,
      responsibilities,
      requirements
    };

    setSubmitting(true);
    try {
      if (editingJob) {
        await API.put(`/recruiter/jobs/${editingJob._id}`, payload);
        toast.success("Job updated successfully!");
      } else {
        await API.post("/recruiter/jobs", payload);
        toast.success("Job listing posted successfully!");
      }
      closeModal();
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${editingJob ? "update" : "post"} job`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === "Open" ? "Closed" : "Open";
    try {
      await API.put(`/recruiter/jobs/${job._id}`, { status: newStatus });
      setJobs((prev) => prev.map((j) => (j._id === job._id ? { ...j, status: newStatus } : j)));
      toast.success(`Job ${newStatus === "Open" ? "reopened" : "closed"}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;

    setDeletingId(jobToDelete._id);
    try {
      await API.delete(`/recruiter/jobs/${jobToDelete._id}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobToDelete._id));
      toast.success("Job deleted successfully");
      setJobToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete job");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardShell role="Recruiter" nav={recruiterNav} title="Jobs" subtitle="Loading job listings...">
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Loading jobs...
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      role="Recruiter"
      nav={recruiterNav}
      title="Jobs"
      subtitle="Manage your posted and draft positions."
      action={
        <button onClick={openCreateModal} className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition active:scale-[0.97] border-none cursor-pointer">
          <Plus className="w-4 h-4" /> Post a job
        </button>
      }
    >
      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          <div className="col-span-4">Title</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Applicants</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        <div className="divide-y divide-border">
          {jobs.map((j) => (
            <div key={j._id} className="flex flex-col gap-3 md:grid md:grid-cols-12 md:gap-4 px-4 sm:px-5 py-4 md:items-center text-sm">
              <div className="md:col-span-4 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-foreground">{j.title}</span>
                  {j.remote && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-success/20 text-foreground font-medium">
                      Remote
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{j.location} · {j.salary || "No salary specified"}</div>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:contents">
                <div className="md:col-span-2"><StatusBadge status={j.type} /></div>
                <div className="md:col-span-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5" /> {j.applicants || 0} applicants
                </div>
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(j)}
                    className="bg-transparent border-none cursor-pointer p-0"
                    title={`Click to ${j.status === "Open" ? "close" : "reopen"} job`}
                  >
                    <StatusBadge status={j.status} />
                  </button>
                </div>
              </div>
              <div className="md:col-span-2 flex items-center justify-start md:justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(j)}
                  className="inline-flex items-center justify-center text-xs p-2 rounded-lg border border-border hover:bg-muted transition bg-transparent cursor-pointer text-foreground"
                  title="Edit job"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setJobToDelete(j)}
                  disabled={deletingId === j._id}
                  className="inline-flex items-center justify-center text-xs p-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition bg-transparent cursor-pointer disabled:opacity-50"
                  title="Delete job"
                >
                  {deletingId === j._id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
          {jobs.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No jobs posted yet. Click "Post a job" to get started.
            </div>
          )}
        </div>
      </div>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 bg-foreground/20 backdrop-blur-sm"
            onClick={closeModal}
          >
            <div
              className="bg-card w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border border-border shadow-xl flex flex-col max-h-[92dvh] sm:max-h-[min(90vh,820px)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {editingJob ? "Edit job" : "Post a new job"}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-1.5 rounded-lg hover:bg-muted border-none bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>
              <div className="overflow-y-auto overscroll-contain flex-1 min-h-0 px-6 pb-6">
                <form className="space-y-3" onSubmit={handleSubmit}>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Job title</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</label>
                      <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Berlin, DE"
                        className={`mt-1.5 ${inputClassName}`}
                        required
                      />
                    </div>
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Salary range</label>
                      <input
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        placeholder="e.g. €80k – €110k"
                        className={`mt-1.5 ${inputClassName}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Min salary (numeric)</label>
                      <input
                        type="number"
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                        placeholder="e.g. 80000"
                        className={`mt-1.5 ${inputClassName}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Max salary (numeric)</label>
                      <input
                        type="number"
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                        placeholder="e.g. 110000"
                        className={`mt-1.5 ${inputClassName}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormSelect id="job-type" label="Type" value={type} onChange={(e) => setType(e.target.value)}>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </FormSelect>
                    <FormSelect id="job-status" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                    </FormSelect>
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id="remote"
                      checked={remote}
                      onChange={(e) => setRemote(e.target.checked)}
                      className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring cursor-pointer"
                    />
                    <label htmlFor="remote" className="text-sm font-medium text-foreground cursor-pointer select-none">
                      Remote position
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Skills (comma separated)</label>
                    <input
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="e.g. React, TypeScript, GraphQL"
                      className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What will the role involve?"
                      className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Responsibilities (one per line)</label>
                    <textarea
                      rows={3}
                      value={responsibilities}
                      onChange={(e) => setResponsibilities(e.target.value)}
                      placeholder={"e.g. Own complex UI features end-to-end\nMentor junior team members\nCollaborate with product & design"}
                      className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Requirements (one per line)</label>
                    <textarea
                      rows={3}
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder={"e.g. 5+ years of React experience\nStrong TypeScript skills\nProduction GraphQL experience"}
                      className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition active:scale-[0.98] border-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> {editingJob ? "Saving..." : "Publishing..."}
                      </>
                    ) : (
                      editingJob ? "Save changes" : "Publish job"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}

      <ConfirmDialog
        open={!!jobToDelete}
        title="Delete job listing?"
        description={
          jobToDelete
            ? `"${jobToDelete.title}" and all related applications will be permanently removed. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete job"
        cancelLabel="Keep job"
        variant="destructive"
        loading={!!deletingId}
        onConfirm={handleDelete}
        onCancel={() => !deletingId && setJobToDelete(null)}
      />
    </DashboardShell>
  );
}
