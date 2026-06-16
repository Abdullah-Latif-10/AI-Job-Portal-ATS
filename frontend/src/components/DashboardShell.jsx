
import { Link, useLocation } from "react-router-dom";
import { Leaf, LogOut } from "lucide-react";

export function DashboardShell({ role, nav, children, title, subtitle, action }) {
  // Grabs the current web URL location path reactive tracker state
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card/40 px-4 py-6 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold tracking-tight">Hireloop</span>
        </Link>

        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground px-2 mb-2">
          {role}
        </div>

        <nav className="flex-1 space-y-1">
          {nav.map((item) => {
            // Evaluates active logic for sub-routes seamlessly 
            const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to + "/"));
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                  active
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          to="/login"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Link>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-5 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Leaf className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Hireloop</span>
        </Link>
        <span className="text-xs text-muted-foreground">{role}</span>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-t border-border px-2 py-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] flex justify-around">
        {nav.slice(0, 5).map((item) => {
          const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to + "/"));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 pt-16 md:pt-0 pb-24 md:pb-0">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-8 md:py-12 animate-fade-up-blur">
          <header className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight" style={{ lineHeight: "1.15" }}>
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1.5">{subtitle}</p>
              )}
            </div>
            {action}
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}

export function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-accent/60 flex items-center justify-center">
            <Icon className="w-4 h-4 text-accent-foreground" />
          </div>
        )}
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Applied: "bg-muted text-muted-foreground",
    Reviewed: "bg-accent/60 text-accent-foreground",
    Shortlisted: "bg-primary/15 text-primary",
    Hired: "bg-success/30 text-foreground",
    Rejected: "bg-destructive/15 text-destructive",
    Open: "bg-primary/15 text-primary",
    Closed: "bg-muted text-muted-foreground",
    Draft: "bg-accent/50 text-accent-foreground",
    Active: "bg-primary/15 text-primary",
    Suspended: "bg-destructive/15 text-destructive",
    Approved: "bg-primary/15 text-primary",
    Pending: "bg-accent/60 text-accent-foreground",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${map[status] || "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}