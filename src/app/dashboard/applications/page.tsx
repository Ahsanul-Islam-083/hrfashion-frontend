"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { fetchMyApplications, fetchMyInterviews, type Interview } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import { Briefcase, PlayCircle, Eye } from "lucide-react";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { InterviewModal } from "@/components/interview/InterviewModal";

export default function MyApplicationsPage() {
  const [activeInterview, setActiveInterview] = useState<{
    applicationId: string;
    jobTitle: string;
    interview: Interview | null;
  } | null>(null);

  const { data: applications, isLoading } = useQuery({
    queryKey: QUERY_KEYS.applications(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return fetchMyApplications(token);
    }
  });

  const { data: interviewsData } = useQuery({
    queryKey: QUERY_KEYS.interviews(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return fetchMyInterviews(token);
    }
  });

  const interviewMap = new Map<string, Interview>(
    (interviewsData?.interviews || []).map(i => [i.applicationId, i])
  );

  const getInterviewButton = (appId: string, jobTitle: string) => {
    const interview = interviewMap.get(appId) || null;
    if (!interview) {
      return (
        <button
          onClick={() => setActiveInterview({ applicationId: appId, jobTitle, interview: null })}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-200 rounded-sm hover:opacity-80 transition-opacity"
        >
          <PlayCircle className="w-3 h-3" /> Start
        </button>
      );
    }
    if (interview.status === "completed") {
      return (
        <button
          onClick={() => setActiveInterview({ applicationId: appId, jobTitle, interview })}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200 rounded-sm hover:opacity-80 transition-opacity"
        >
          <Eye className="w-3 h-3" /> {interview.score ?? "—"}/100
        </button>
      );
    }
    return (
      <button
        onClick={() => setActiveInterview({ applicationId: appId, jobTitle, interview })}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-100 dark:bg-amber-900 dark:text-amber-200 rounded-sm hover:opacity-80 transition-opacity"
      >
        <PlayCircle className="w-3 h-3" /> Continue
      </button>
    );
  };

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-serif mb-2">My Applications</h1>
          <p className="text-muted">Track the status of your job applications.</p>
        </div>

        <div className="bg-background rounded-sm border border-card-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-card border-b border-card-border">
                <tr>
                  <th className="px-6 py-4 font-medium uppercase tracking-widest text-xs text-muted">Role</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-widest text-xs text-muted">Date Applied</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-widest text-xs text-muted">Status</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-widest text-xs text-muted">Interview</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-widest text-xs text-muted text-right">Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted">Loading applications...</td>
                  </tr>
                ) : applications?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Briefcase className="w-12 h-12 text-muted mb-4" />
                        <p className="text-muted mb-6">You haven&apos;t applied to any roles yet.</p>
                        <Link
                          href="/careers"
                          className="px-6 py-3 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity"
                        >
                          Explore Careers
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  applications?.map((app) => (
                    <tr key={app._id} className="hover:bg-foreground/5 transition-colors">
                      <td className="px-6 py-4 font-medium">{app.jobTitle || app.job?.title || "Unknown Role"}</td>
                      <td className="px-6 py-4 text-muted">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest
                          ${app.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'}
                        `}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getInterviewButton(app._id, app.jobTitle || app.job?.title || "Position")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted hover:text-foreground underline underline-offset-4 transition-colors"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {activeInterview && (
        <InterviewModal
          applicationId={activeInterview.applicationId}
          jobTitle={activeInterview.jobTitle}
          initialInterview={activeInterview.interview}
          onClose={() => setActiveInterview(null)}
        />
      )}
    </>
  );
}
