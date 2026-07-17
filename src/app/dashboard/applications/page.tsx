"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { fetchMyApplications } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import { Briefcase } from "lucide-react";

export default function MyApplicationsPage() {
  const { data: applications, isLoading } = useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return fetchMyApplications(token);
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif mb-2">My Applications</h1>
        <p className="text-neutral-500">Track the status of your job applications.</p>
      </div>

      <div className="bg-background rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium uppercase tracking-widest text-xs text-neutral-500">Role</th>
                <th className="px-6 py-4 font-medium uppercase tracking-widest text-xs text-neutral-500">Date Applied</th>
                <th className="px-6 py-4 font-medium uppercase tracking-widest text-xs text-neutral-500">Status</th>
                <th className="px-6 py-4 font-medium uppercase tracking-widest text-xs text-neutral-500 text-right">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">Loading applications...</td>
                </tr>
              ) : applications?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Briefcase className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mb-4" />
                      <p className="text-neutral-500 mb-6">You haven&apos;t applied to any roles yet.</p>
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
                  <tr key={app._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{app.job?.title || "Unknown Role"}</td>
                    <td className="px-6 py-4 text-neutral-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest
                        ${app.status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                          app.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}
                      `}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a 
                        href={app.resumeUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-neutral-500 hover:text-foreground underline underline-offset-4 transition-colors"
                      >
                        View Link
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
  );
}
