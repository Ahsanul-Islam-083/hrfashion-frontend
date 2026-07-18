"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight, FileText, Heart, Clock } from "lucide-react";
import { fetchMyApplications, fetchWishlist } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { RecommendationsSection } from "@/components/product/RecommendationsSection";

export default function DashboardOverviewPage() {
  const { data: applications, isLoading: isAppsLoading } = useQuery({
    queryKey: QUERY_KEYS.applications(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return fetchMyApplications(token);
    }
  });

  const { data: wishlist, isLoading: isWishlistLoading } = useQuery({
    queryKey: QUERY_KEYS.wishlist(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return fetchWishlist(token);
    }
  });

  const pendingApps = applications?.filter(app => app.status === "pending").length || 0;
  const recentApps = applications?.slice(0, 3) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif mb-2">Overview</h1>
        <p className="text-muted">Welcome back to your dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background rounded-sm border border-card-border p-6">
          <div className="flex items-center gap-3 mb-2 text-muted">
            <FileText className="w-5 h-5" />
            <h3 className="font-medium text-sm uppercase tracking-widest">Total Applications</h3>
          </div>
          <p className="text-3xl font-serif">
            {isAppsLoading ? "..." : (applications?.length || 0)}
          </p>
        </div>
        
        <div className="bg-background rounded-sm border border-card-border p-6">
          <div className="flex items-center gap-3 mb-2 text-muted">
            <Clock className="w-5 h-5" />
            <h3 className="font-medium text-sm uppercase tracking-widest">Pending Review</h3>
          </div>
          <p className="text-3xl font-serif">
            {isAppsLoading ? "..." : pendingApps}
          </p>
        </div>

        <div className="bg-background rounded-sm border border-card-border p-6">
          <div className="flex items-center gap-3 mb-2 text-muted">
            <Heart className="w-5 h-5" />
            <h3 className="font-medium text-sm uppercase tracking-widest">Wishlist Items</h3>
          </div>
          <p className="text-3xl font-serif">
            {isWishlistLoading ? "..." : (wishlist?.items?.length || 0)}
          </p>
        </div>
      </div>

      <div className="bg-background rounded-sm border border-card-border overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-card-border">
          <h2 className="text-lg font-serif">Recent Applications</h2>
          <Link href="/dashboard/applications" className="text-sm text-muted hover:text-foreground flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="divide-y divide-card-border">
          {isAppsLoading ? (
            <div className="p-8 text-center text-muted">Loading...</div>
          ) : recentApps.length === 0 ? (
            <div className="p-8 text-center text-muted">
              You haven&apos;t submitted any applications yet.
            </div>
          ) : (
            recentApps.map(app => (
              <div key={app._id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-foreground/5 transition-colors">
                <div>
                  <h3 className="font-medium">{app.job?.title || "Application"}</h3>
                  <p className="text-sm text-muted mt-1">
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-widest
                    ${app.status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                      app.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}
                  `}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <RecommendationsSection />
    </div>
  );
}
