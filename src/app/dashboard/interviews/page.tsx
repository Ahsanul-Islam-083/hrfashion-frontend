"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyInterviews, type Interview } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { InterviewModal } from "@/components/interview/InterviewModal";
import { ClipboardList } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-card text-muted",
  in_progress: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

function InterviewsContent() {
  const [activeInterview, setActiveInterview] = useState<Interview | null>(null);
  const [autoStartAppId, setAutoStartAppId] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const appId = searchParams.get("applicationId");
    if (appId) {
      router.replace("/dashboard/interviews");
      setAutoStartAppId(appId);
    }
  }, [searchParams, router]);

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.interviews(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return fetchMyInterviews(token);
    },
  });

  const interviews = data?.interviews || [];
  
  const closeAll = () => {
    setActiveInterview(null);
    setAutoStartAppId(null);
  };

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-serif mb-2">My Interviews</h1>
          <p className="text-muted">AI-generated interviews for your job applications.</p>
        </div>

        <div className="bg-background rounded-sm border border-card-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-card border-b border-card-border">
                <tr>
                  {["Position", "Date", "Status", "Score", "Action"].map(h => (
                    <th key={h} className="px-6 py-4 font-medium uppercase tracking-widest text-xs text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {isLoading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-muted">Loading...</td></tr>
                ) : interviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center">
                        <ClipboardList className="w-12 h-12 text-muted mb-4" />
                        <p className="text-muted">No interviews yet. Start one from My Applications.</p>
                      </div>
                    </td>
                  </tr>
                ) : interviews.map(iv => (
                  <tr key={iv._id} className="hover:bg-card/50 transition-colors cursor-pointer" onClick={() => setActiveInterview(iv)}>
                    <td className="px-6 py-4 font-medium">{iv.jobTitle || "Position"}</td>
                    <td className="px-6 py-4 text-muted">{new Date(iv.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest ${STATUS_STYLES[iv.status] || ""}`}>
                        {iv.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {iv.score !== null ? (
                        <span className={`font-semibold ${iv.score >= 80 ? "text-green-600 dark:text-green-400" : iv.score >= 60 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`}>
                          {iv.score}/100
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-muted underline underline-offset-4 hover:text-foreground transition-colors">
                        {iv.status === "completed" ? "View Results" : "Continue"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {activeInterview && (
        <InterviewModal
          applicationId={activeInterview.applicationId}
          jobTitle={activeInterview.jobTitle || "Position"}
          initialInterview={activeInterview}
          onClose={closeAll}
        />
      )}
      {autoStartAppId && !activeInterview && (
        <InterviewModal
          applicationId={autoStartAppId}
          jobTitle="Application"
          onClose={closeAll}
        />
      )}
    </>
  );
}

export default function InterviewsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <InterviewsContent />
    </Suspense>
  );
}
