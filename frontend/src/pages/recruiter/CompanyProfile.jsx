import { useState, useEffect, useRef } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { recruiterNav } from "@/lib/role-navs";
import API from "@/api/axios";
import { toast } from "sonner";
import { Loader2, Upload, ImageIcon, Building2 } from "lucide-react";

export default function CompanyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    API.get("/recruiter/company")
      .then((res) => {
        const data = res.data || {};
        setProfile(data);
        setName(data.name || "");
        setWebsite(data.website || "");
        setIndustry(data.industry || "");
        setSize(data.size || "");
        setDescription(data.description || "");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load company profile:", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Company name is required.");
      return;
    }
    setSaving(true);
    try {
      const res = await API.put("/recruiter/company", {
        name: name.trim(),
        website: website.trim(),
        industry: industry.trim(),
        size: size.trim(),
        description: description.trim()
      });
      setProfile(res.data);
      toast.success("Company profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("logo", file);

      const res = await API.post("/recruiter/company/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setProfile(res.data.profile);
      toast.success("Company logo uploaded successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload logo");
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <DashboardShell role="Recruiter" nav={recruiterNav} title="Company profile" subtitle="Loading company profile details...">
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Loading company details...
        </div>
      </DashboardShell>
    );
  }

  const logoUrl = profile?.logo?.url;
  const hasHeaderDetails = name.trim() || industry.trim() || size.trim();

  return (
    <DashboardShell
      role="Recruiter"
      nav={recruiterNav}
      title="Company profile"
      subtitle={name.trim() ? `Manage details and approval status for ${name.trim()}.` : "Add your company details to get verified and post jobs."}
    >
      <form onSubmit={handleSave} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-card border border-border p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={name.trim() ? `${name} logo` : "Company logo"}
                      className="w-16 h-16 rounded-2xl object-cover border border-border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-accent/60 flex items-center justify-center">
                      <Building2 className="w-7 h-7 text-muted-foreground" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="absolute inset-0 rounded-2xl bg-foreground/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer border-none"
                    title="Upload logo"
                  >
                    {uploadingLogo ? (
                      <Loader2 className="w-5 h-5 text-background animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5 text-background" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  {hasHeaderDetails ? (
                    <>
                      {name.trim() && (
                        <h2 className="text-lg font-semibold tracking-tight text-foreground">{name}</h2>
                      )}
                      {(industry.trim() || size.trim()) && (
                        <p className="text-xs text-muted-foreground">
                          {[industry.trim(), size.trim()].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No company details added yet.</p>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 bg-transparent border-none cursor-pointer p-0"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    {uploadingLogo ? "Uploading..." : logoUrl ? "Change logo" : "Upload logo"}
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Approval Status</span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${
                  profile?.status === "Approved" ? "bg-primary/15 text-primary" :
                  profile?.status === "Rejected" ? "bg-destructive/15 text-destructive" : "bg-accent/60 text-accent-foreground"
                }`}>
                  {profile?.status || "Pending"}
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="Enter your company name"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Website URL</label>
                <input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="https://yourcompany.com"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Industry</label>
                <input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="Enter your industry"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company Size</label>
                <input
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-ring text-foreground"
                  placeholder="Enter company size"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">About Company</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="Describe your company..."
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition active:scale-[0.97] border-none cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="rounded-2xl bg-card border border-border p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Verification</div>
            <div className="mt-2 text-sm text-foreground/80">
              {profile?.status === "Approved" ? (
                "Your company details have been approved. Candidates will see this profile as verified on job listings."
              ) : profile?.status === "Rejected" ? (
                "Your company profile verification was rejected. Please update details and contact support."
              ) : (
                "Complete your company profile and save changes. An administrator will review it before jobs can be verified."
              )}
            </div>
          </div>
        </aside>
      </form>
    </DashboardShell>
  );
}
