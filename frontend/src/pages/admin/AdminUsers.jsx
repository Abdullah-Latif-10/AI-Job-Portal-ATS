import { useState } from "react";
import { DashboardShell, StatusBadge } from "@/components/DashboardShell";
import { adminNav } from "@/lib/role-navs";
import { USERS } from "@/lib/mock-data";
import { Search } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsers() {
  const [q, setQ] = useState("");
  const visible = USERS.filter((u) =>
    `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <DashboardShell role="Admin" nav={adminNav} title="Users" subtitle={`${USERS.length} total platform users`}>
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
            <div key={u.id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center text-sm">
              <div className="col-span-12 md:col-span-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {u.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate text-foreground">{u.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                </div>
              </div>
              <div className="col-span-4 md:col-span-3 text-xs text-muted-foreground">{u.role}</div>
              <div className="col-span-4 md:col-span-2 text-xs text-muted-foreground">{u.joined}</div>
              <div className="col-span-4 md:col-span-2"><StatusBadge status={u.status} /></div>
              <div className="col-span-12 md:col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => toast.success(u.status === "Active" ? "User suspended" : "User reactivated")}
                  className="text-xs text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  {u.status === "Active" ? "Suspend" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}