"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Package, Briefcase, FileText, Users } from "lucide-react";
import { fetchAnalyticsOverview } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import { QUERY_KEYS } from "@/lib/queryKeys";

const STATUS_COLORS: Record<string, string> = { pending: "#eab308", accepted: "#22c55e", rejected: "#ef4444" };

export default function AdminOverviewPage() {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.admin.overview(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return fetchAnalyticsOverview(token);
    },
  });

  const pieData = data ? [
    { name: "Pending", value: data.applicationsByStatus.pending },
    { name: "Accepted", value: data.applicationsByStatus.accepted },
    { name: "Rejected", value: data.applicationsByStatus.rejected },
  ] : [];

  const barData = data ? [
    { name: "Pending", count: data.applicationsByStatus.pending },
    { name: "Accepted", count: data.applicationsByStatus.accepted },
    { name: "Rejected", count: data.applicationsByStatus.rejected },
  ] : [];

  const stats = [
    { label: "Total Products", value: data?.totalProducts, icon: Package },
    { label: "Open Jobs", value: data?.openJobs, icon: Briefcase },
    { label: "Applications", value: data?.totalApplications, icon: FileText },
    { label: "Total Users", value: data?.totalUsers, icon: Users },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif mb-1">Admin Overview</h1>
        <p className="text-muted text-sm">Site-wide metrics and recent activity.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-background rounded-sm border border-card-border p-6">
            <div className="flex items-center gap-2 text-muted mb-2">
              <Icon className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest font-medium">{label}</span>
            </div>
            <p className="text-3xl font-serif">{isLoading ? "..." : (value ?? 0)}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background rounded-sm border border-card-border p-6">
          <h2 className="text-sm font-medium uppercase tracking-widest mb-6">Applications by Status (Bar)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={40}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="count">
                {barData.map((entry, index) => (
                  <Cell key={index} fill={STATUS_COLORS[entry.name.toLowerCase()] || "#94a3b8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-background rounded-sm border border-card-border p-6">
          <h2 className="text-sm font-medium uppercase tracking-widest mb-6">Applications Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3} labelLine={false}>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={STATUS_COLORS[entry.name.toLowerCase()] || "#94a3b8"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-background rounded-sm border border-card-border overflow-hidden">
        <div className="p-6 border-b border-card-border">
          <h2 className="text-lg font-serif">Recent Applications</h2>
        </div>
        <div className="divide-y divide-card-border">
          {isLoading ? (
            <div className="p-8 text-center text-muted">Loading...</div>
          ) : data?.recentApplications.length === 0 ? (
            <div className="p-8 text-center text-muted">No applications yet.</div>
          ) : (
            data?.recentApplications.map((app) => (
              <div key={app._id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <p className="font-medium">{app.applicantName}</p>
                  <p className="text-sm text-muted">{app.jobTitle || app.jobId} · {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
                <span className={`self-start px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest
                  ${app.status === "accepted" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                    app.status === "rejected" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>
                  {app.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
