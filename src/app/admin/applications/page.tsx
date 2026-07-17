"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { getToken } from "@/lib/auth-client";
import { fetchApplicationsAdmin, updateApplicationStatus } from "@/lib/api";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminApplicationsPage() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-applications", statusFilter],
    queryFn: async () => {
      const t = await getToken();
      if (!t) throw new Error("No token");
      return fetchApplicationsAdmin(t, statusFilter ? `status=${statusFilter}` : undefined);
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      setPendingAction(id);
      const t = await getToken();
      if (!t) throw new Error("No token");
      return updateApplicationStatus(id, status, t);
    },
    onSuccess: (updated) => {
      toast.success(`Application ${updated.status}`);
      qc.setQueryData(["admin-applications", statusFilter], (old: any) => old ? { ...old, applications: old.applications.map((a: any) => a._id === updated._id ? updated : a) } : old);
      setPendingAction(null);
    },
    onError: (e: any) => { toast.error(e.message); setPendingAction(null); },
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif mb-1">Applications</h1>
          <p className="text-neutral-500 text-sm">{data?.total ?? 0} total applications</p>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-background rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
              <tr>{["Applicant", "Email", "Applied On", "Status", "Actions"].map(h => <th key={h} className="px-5 py-3.5 font-medium uppercase tracking-widest text-xs text-neutral-500">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {isLoading ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-neutral-500">Loading...</td></tr>
              ) : data?.applications.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-16 text-center text-neutral-500">No applications found.</td></tr>
              ) : data?.applications.map(app => (
                <tr key={app._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium">{app.applicantName}</p>
                    <p className="text-xs text-neutral-500">{app.jobId}</p>
                  </td>
                  <td className="px-5 py-3 text-neutral-500">{app.email}</td>
                  <td className="px-5 py-3 text-neutral-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest ${STATUS_STYLES[app.status] || ""}`}>{app.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    {app.status === "pending" ? (
                      <div className="flex items-center gap-2">
                        <button disabled={pendingAction === app._id} onClick={() => statusMutation.mutate({ id: app._id, status: "accepted" })} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded-sm hover:opacity-80 transition-opacity disabled:opacity-50">
                          {pendingAction === app._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />} Accept
                        </button>
                        <button disabled={pendingAction === app._id} onClick={() => statusMutation.mutate({ id: app._id, status: "rejected" })} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-sm hover:opacity-80 transition-opacity disabled:opacity-50">
                          {pendingAction === app._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />} Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400 italic">Reviewed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
