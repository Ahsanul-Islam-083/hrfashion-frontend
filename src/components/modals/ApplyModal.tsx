"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

interface ApplyModalProps {
  jobId: string;
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyModal({ jobId, jobTitle, isOpen, onClose }: ApplyModalProps) {
  const { data: session } = useSession();
  
  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    resumeUrl: "",
    coverLetter: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        applicantName: session.user.name || "",
        email: session.user.email || ""
      }));
    }
  }, [session]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // @ts-ignore - auth-client types might be missing getToken, fallback to cookie or fetch
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // The proxy or better-auth client will handle cookies, but if a JWT is strictly needed:
          // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId,
          ...formData
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit application");
      }

      toast.success("Application submitted successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-background w-full max-w-lg rounded-sm border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-xl font-serif">Apply for Role</h2>
            <p className="text-sm text-neutral-500">{jobTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="apply-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest font-medium">Full Name *</label>
              <input 
                required 
                type="text" 
                value={formData.applicantName}
                onChange={e => setFormData({...formData, applicantName: e.target.value})}
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest font-medium">Email *</label>
                <input 
                  required 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest font-medium">Phone *</label>
                <input 
                  required 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest font-medium">Resume/CV URL *</label>
              <input 
                required 
                type="url" 
                placeholder="Link to Drive, Dropbox, Portfolio..."
                value={formData.resumeUrl}
                onChange={e => setFormData({...formData, resumeUrl: e.target.value})}
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest font-medium">Cover Letter (Optional)</label>
              <textarea 
                rows={4}
                value={formData.coverLetter}
                onChange={e => setFormData({...formData, coverLetter: e.target.value})}
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground resize-none"
              ></textarea>
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-3 border border-neutral-200 dark:border-neutral-800 text-sm font-medium uppercase tracking-widest rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="apply-form"
            disabled={isSubmitting}
            className="px-8 py-3 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center min-w-[140px]"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
