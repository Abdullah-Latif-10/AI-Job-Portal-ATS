import { useState, useEffect } from "react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { adminNav } from "@/lib/role-navs";
import API from "@/api/axios";
import { Users, Building2, Briefcase, TrendingUp } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)"
];

const chartTooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12
};

export default function AdminHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/dashboard-stats")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load admin stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DashboardShell role="Admin" nav={adminNav} title="Platform overview" subtitle="Loading platform summary...">
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Loading platform statistics...
        </div>
      </DashboardShell>
    );
  }

  const { stats = {}, signups = [], jobsByType = [], appStatuses = [], trendingSkills = [] } = data || {};

  return (
    <DashboardShell role="Admin" nav={adminNav} title="Platform overview" subtitle="Hireloop at a glance.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="Total users" value={stats.totalUsers || 0} icon={Users} hint="Registered users" />
        <StatCard label="Companies" value={stats.activeCompanies || 0} icon={Building2} hint="Approved companies" />
        <StatCard label="Active jobs" value={stats.activeJobs || 0} icon={Briefcase} hint="Open job listings" />
        <StatCard label="Placement rate" value={stats.placementRate || "0%"} icon={TrendingUp} hint="Hired applications ratio" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard className="lg:col-span-2" title="Signups over time">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={signups} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Line type="monotone" dataKey="users" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Application status">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={appStatuses} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {appStatuses.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {appStatuses.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="truncate">{s.name}</span>
                <span className="ml-auto text-foreground tabular-nums">{s.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard className="lg:col-span-3" title="Jobs by type">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={jobsByType} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="type" stroke="var(--muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="count" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {trendingSkills.length > 0 && (
          <ChartCard className="lg:col-span-3" title="Trending skills in open jobs">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trendingSkills} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="skill" stroke="var(--muted-foreground)" fontSize={11} axisLine={false} tickLine={false} interval={0} angle={-25} textAnchor="end" height={60} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="count" fill="var(--chart-3)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>
    </DashboardShell>
  );
}

function ChartCard({ title, children, className = "" }) {
  return (
    <div className={`rounded-2xl bg-card border border-border p-4 sm:p-5 min-w-0 overflow-hidden ${className}`}>
      <h3 className="text-sm font-semibold tracking-tight mb-4 text-foreground">{title}</h3>
      {children}
    </div>
  );
}
