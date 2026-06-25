import { useState, useEffect } from "react";
import { DashboardShell, StatusBadge } from "@/components/DashboardShell";
import { adminNav } from "@/lib/role-navs";
import API from "@/api/axios";
import { Search } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    API.get("/admin/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load users:", err);
        setLoading(false);
      });
  }, []);

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const res = await API.put(`/admin/users/${id}/toggle-status`);
      const updatedUser = res.data.user;
      
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id
            ? { ...u, isActive: updatedUser.isActive, status: updatedUser.status }
            : u
        )
      );

      toast.success(res.data.message || "User status updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to toggle user status");
    }
  };

  const visible = users.filter((u) =>
    `${u.name || ""} ${u.email || ""} ${u.role || ""}`.toLowerCase().includes(q.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardShell role="Admin" nav={adminNav} title="Users" subtitle="Loading platform users...">
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Loading users...
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Admin" nav={adminNav} title="Users" subtitle={`${users.length} total platform users`}>
      <div className="rounded-xl bg-card border border-input px-3.5 py-2.5 flex items-center gap-2 mb-5 shadow-sm">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, email, role"
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground border-none p-0"
        />
      </div>

      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          <div className="col-span-4">User</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-2">Joined</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1" />
        </div>
        <div className="divide-y divide-border">
          {visible.map((u) => (
            <div key={u._id} className="flex flex-col gap-3 md:grid md:grid-cols-12 md:gap-4 px-4 sm:px-5 py-4 md:items-center text-sm">
              <div className="md:col-span-4 flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {(u.name || "U").split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate text-foreground">{u.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:contents">
                <div className="md:col-span-3 text-xs text-muted-foreground"><span className="md:hidden font-medium text-foreground/70 mr-1">Role:</span>{u.role}</div>
                <div className="md:col-span-2 text-xs text-muted-foreground"><span className="md:hidden font-medium text-foreground/70 mr-1">Joined:</span>{u.joined}</div>
                <div className="md:col-span-2"><StatusBadge status={u.status} /></div>
              </div>
              <div className="md:col-span-1 md:text-right">
                <button
                  type="button"
                  onClick={() => toggleUserStatus(u._id, u.status)}
                  className="text-xs text-primary hover:underline bg-transparent border-none p-0 cursor-pointer text-left"
                >
                  {u.status === "Active" ? "Suspend" : "Activate"}
                </button>
              </div>
            </div>
          ))}
          {visible.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No users found matching your search.
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}