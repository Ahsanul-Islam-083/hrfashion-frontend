"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchJobs } from "@/lib/api";
import { JobCard } from "@/components/cards/JobCard";
import { JobCardSkeleton } from "@/components/skeletons/JobCardSkeleton";
import { PageMotion, StaggerContainer, StaggerItem } from "@/components/ui/PageMotion";

function CareersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading } = useQuery({
    queryKey: ["jobs", searchParams.toString()],
    queryFn: () => fetchJobs(searchParams),
  });

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") {
      params.set("page", "1");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <PageMotion>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 min-h-screen">
        <div className="max-w-2xl mb-12">
        <h1 className="text-4xl font-serif mb-4">Careers</h1>
        <p className="text-muted leading-relaxed">
          Join our team of designers, engineers, and creatives. We are always looking for passionate individuals to help us shape the future of fashion.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-4 border-b border-card-border">
        <h2 className="text-xl font-medium">Open Positions</h2>
        
        <select 
          className="px-4 py-2 bg-card border border-card-border rounded-sm text-sm focus:outline-none w-full sm:w-auto"
          value={searchParams.get("department") || ""}
          onChange={(e) => updateParam("department", e.target.value || null)}
        >
          <option value="">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="Operations">Operations</option>
          <option value="Retail">Retail</option>
        </select>
      </div>

      <div className="mb-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(4).fill(0).map((_, i) => <JobCardSkeleton key={i} />)}
          </div>
        ) : data?.jobs.length === 0 ? (
          <div className="text-center py-24 text-muted bg-card rounded-sm border border-card-border">
            No open positions found matching your criteria. Check back later!
          </div>
        ) : (
          <>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data?.jobs.map((job) => (
                <StaggerItem key={job._id}>
                  <JobCard {...job} />
                </StaggerItem>
              ))}
            </StaggerContainer>
            
            {data && data.totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2">
                <button 
                  disabled={data.page <= 1}
                  onClick={() => updateParam("page", (data.page - 1).toString())}
                  className="p-2 border border-card-border rounded-sm disabled:opacity-50 hover:bg-card transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium px-4">
                  Page {data.page} of {data.totalPages}
                </span>
                <button 
                  disabled={data.page >= data.totalPages}
                  onClick={() => updateParam("page", (data.page + 1).toString())}
                  className="p-2 border border-card-border rounded-sm disabled:opacity-50 hover:bg-card transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </PageMotion>
  );
}

export default function CareersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center">Loading careers...</div>}>
      <CareersContent />
    </Suspense>
  );
}
