"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2, ExternalLink, Eye } from "lucide-react";
import { getToken } from "@/lib/auth-client";
import { fetchApplicationsAdmin, updateApplicationStatus, fetchInterviewsAdmin, type Interview } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queryKeys";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const INTERVIEW_STATUS_STYLES: Record<string, string> = {
  in_progress: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

function InterviewResultsModal({ interview, onClose }: { interview: Interview; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog">
      <div className="bg-background w-full max-w-2xl rounded-sm border border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-start p-6 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
          <div>
            <h2 className="text-xl font-serif">Interview Results</h2>
            <p className="text-sm text-neutral-500">{interview.jobTitle} — {interview.applicantName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center gap-6 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-sm border border-neutral-200 dark:border-neutral-800">
            <div className="text-center">
              <p className="text-xs text-neutral-500 mb-1">Score</p>
              <p className={`text-4xl font-serif ${(interview.score ?? 0) >= 80 ? "text-green-600 dark:text-green-400" : (interview.score ?? 0) >= 60 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`}>
                {interview.score ?? "—"}<span className="text-lg text-neutral-400">/100</span>
              </p>
            </div>
            {interview.feedback && (
              <div>
                <p className="text-xs text-neutral-500 mb-1 uppercase tracking-widest font-medium">AI Feedback</p>
                <p className="text-sm leading-relaxed">{interview.feedback}</p>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium">Q&A</p>
            {interview.questions.map((q, i) => {
              const ans = interview.answers.find(a => a.questionId === q.id);
              return (
                <div key={q.id} className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-neutral-400 flex-shrink-0 mt-0.5">Q{i + 1}</span>
                    <p className="text-sm font-medium">{q.question}</p>
                  </div>
                  {ans?.answer && (
                    <div className="flex items-start gap-2 pl-4">
                      <span className="text-xs text-neutral-400 flex-shrink-0 mt-0.5">A</span>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{ans.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity">Close</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminApplicationsPage() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [viewingInterview, setViewingInterview] = useState<Interview | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.admin.applications(statusFilter),
    queryFn: async () => {
      const t = await getToken();
      if (!t) throw new Error("No token");
      return fetchApplicationsAdmin(t, statusFilter ? `status=${statusFilter}` : undefined);
    },
  });

  const { data: interviewsData } = useQuery({
    queryKey: QUERY_KEYS.admin.interviews(),
    queryFn: async () => {
      const t = await getToken();
      if (!t) throw new Error("No token");
      return fetchInterviewsAdmin(t);
    },
  });

  const interviewMap = new Map<string, Interview>(
    (interviewsData?.interviews || []).map(i => [i.applicationId, i])
  );

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      setPendingAction(id);
      const t = await getToken();
      if (!t) throw new Error("No token");
      return updateApplicationStatus(id, status, t);
    },
    onSuccess: (updated) => {
      toast.success(`Application ${updated.status}`);
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.applications() });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.overview() });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.applications() });
      setPendingAction(null);
    },
    onError: (e: any) => { toast.error(e.message); setPendingAction(null); },
  });

  return (
    <>
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
                <tr>{["Applicant", "Role", "Email", "Applied On", "Status", "Resume", "Interview", "Actions"].map(h => <th key={h} className="px-5 py-3.5 font-medium uppercase tracking-widest text-xs text-neutral-500">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {isLoading ? (
                  <tr><td colSpan={8} className="px-5 py-10 text-center text-neutral-500">Loading...</td></tr>
                ) : data?.applications.length === 0 ? (
                  <tr><td colSpan={8} className="px-5 py-16 text-center text-neutral-500">No applications found.</td></tr>
                ) : data?.applications.map(app => {
                  const iv = interviewMap.get(app._id);
                  return (
                    <tr key={app._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-medium">{app.applicantName}</p>
                      </td>
                      <td className="px-5 py-3 text-neutral-500 text-xs">{app.job?.title || app.jobId}</td>
                      <td className="px-5 py-3 text-neutral-500">{app.email}</td>
                      <td className="px-5 py-3 text-neutral-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest ${STATUS_STYLES[app.status] || ""}`}>{app.status}</span>
                      </td>
                      <td className="px-5 py-3">
                        {app.resumeUrl ? (
                          <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-neutral-500 hover:text-foreground transition-colors text-xs">
                            <ExternalLink className="w-3 h-3" /> Resume
                          </a>
                        ) : <span className="text-neutral-400 text-xs">—</span>}
                      </td>
                      <td className="px-5 py-3">
                        {iv ? (
                          <button onClick={() => iv.status === "completed" ? setViewingInterview(iv) : undefined} className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest ${INTERVIEW_STATUS_STYLES[iv.status] || "bg-neutral-100 text-neutral-600"} ${iv.status === "completed" ? "cursor-pointer hover:opacity-80" : ""}`}>
                            {iv.status === "completed" && <Eye className="w-3 h-3" />}
                            {iv.status === "completed" ? `${iv.score ?? "—"}/100` : "In Progress"}
                          </button>
                        ) : <span className="text-neutral-400 text-xs">—</span>}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {viewingInterview && (
        <InterviewResultsModal interview={viewingInterview} onClose={() => setViewingInterview(null)} />
      )}
    </>
  );
}
