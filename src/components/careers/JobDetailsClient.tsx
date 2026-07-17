"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { MapPin, Briefcase, Clock, Calendar, ArrowLeft } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { ApplyModal } from "@/components/modals/ApplyModal";
import type { Job } from "@/lib/api";

export function JobDetailsClient({ job }: { job: Job }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const handleApplyClick = () => {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    setIsApplyModalOpen(true);
  };

  const formattedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 min-h-screen">
      <Link 
        href="/careers" 
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-foreground transition-colors mb-8 uppercase tracking-widest font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Careers
      </Link>
      
      <div className="bg-background rounded-sm border border-neutral-200 dark:border-neutral-800 p-8 md:p-12 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif mb-4">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.department}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {job.type.replace("-", " ")}</span>
            </div>
          </div>
          <button 
            onClick={handleApplyClick}
            className="px-8 py-4 bg-foreground text-background font-medium uppercase tracking-widest text-sm rounded-sm hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Apply Now
          </button>
        </div>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3 className="text-lg font-serif mb-4">About the Role</h3>
          <p className="whitespace-pre-wrap leading-relaxed text-neutral-600 dark:text-neutral-400 mb-10">
            {job.description}
          </p>
          
          <h3 className="text-lg font-serif mb-4">Requirements</h3>
          <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-400 mb-10">
            {job.requirements.map((req, idx) => (
              <li key={idx} className="pl-2 leading-relaxed">{req}</li>
            ))}
          </ul>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-widest mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <Calendar className="w-4 h-4" /> Posted on {formattedDate}
        </div>
      </div>
      
      <ApplyModal 
        jobId={job._id}
        jobTitle={job.title}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
}
