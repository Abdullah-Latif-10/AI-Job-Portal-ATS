import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { adminNav } from "@/lib/role-navs";
import { Users, Building2, Briefcase, TrendingUp } from "lucide-react";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid 
} from "recharts";

const signups = [
  { m: "Jan", users: 120 }, { m: "Feb", users: 180 }, { m: "Mar", users: 240 },
  { m: "Apr", users: 320 }, { m: "May", users: 410 }, { m: "Jun", users: 520 },
];

const jobsByType = [
  { type: "Full-time", count: 142 }, { type: "Contract", count: 38 },
  { type: "Part-time", count: 22 }, { type: "Internship", count: 15 },
];

const appStatuses = [
  { name: "Applied", value: 540 }, { name: "Reviewed", value: 230 },
  { name: "Shortlisted", value: 110 }, { name: "Hired", value: 42 },
];

const COLORS = ["oklch(0.42 0.04 55)", "oklch(0.55 0.10 60)", "oklch(0.78 0.14 75)", "oklch(0.88 0.06 70)"];

export default function AdminHome() {
  return (
    <DashboardShell role="Admin" nav={adminNav} title="Platform overview" subtitle="Hireloop at a glance.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="Total users" value="1,284" icon={Users} hint="+18% MoM" />
        <StatCard label="Companies" value="186" icon={Building2} hint="+12 this month" />
        <StatCard label="Active jobs" value="217" icon={Briefcase} />
        <StatCard label="Avg match" value="78%" icon={TrendingUp} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard className="lg:col-span-2" title="Signups over time">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={signups} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="oklch(0.92 0.01 70)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="m" stroke="oklch(0.48 0.03 60)" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="oklch(0.48 0.03 60)" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="users" stroke="oklch(0.42 0.04 55)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Application status">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={appStatuses} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {appStatuses.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {appStatuses.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                {s.name} <span className="ml-auto text-foreground tabular-nums">{s.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard className="lg:col-span-3" title="Jobs by type">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={jobsByType} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="oklch(0.92 0.01 70)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="type" stroke="oklch(0.48 0.03 60)" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="oklch(0.48 0.03 60)" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} cursor={{ fill: "oklch(0.95 0.01 70)" }} />
              <Bar dataKey="count" fill="oklch(0.42 0.04 55)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </DashboardShell>
  );
}

function ChartCard({ title, children, className = "" }) {
  return (
    <div className={`rounded-2xl bg-card border border-border p-5 ${className}`}>
      <h3 className="text-sm font-semibold tracking-tight mb-4">{title}</h3>
      {children}
    </div>
  );
}