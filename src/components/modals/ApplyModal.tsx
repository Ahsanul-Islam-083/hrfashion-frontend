"use client";

import { useState, useEffect, useRef } from "react";
import { X, Loader2, Upload, FileCheck, FileX } from "lucide-react";
import { toast } from "sonner";
import { useSession, getToken } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { submitApplication } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queryKeys";

interface ApplyModalProps {
  jobId: string;
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const ACCEPTED_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function ApplyModal({ jobId, jobTitle, isOpen, onClose }: ApplyModalProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    resumeUrl: "",
    coverLetter: ""
  });
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [showInterviewPrompt, setShowInterviewPrompt] = useState<string | null>(null);

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Only PDF, DOC, and DOCX files are accepted.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("File size must be under 5MB.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading resume...");

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
        { method: "POST", body: formDataUpload }
      );
      const data = await res.json();

      if (!data.secure_url) throw new Error("Upload failed");

      setFormData(prev => ({ ...prev, resumeUrl: data.secure_url }));
      setUploadedFileName(file.name);
      toast.success("Resume uploaded!", { id: toastId });
    } catch {
      toast.error("Failed to upload resume. Please try again.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const applyMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const token = await getToken();
      return submitApplication({ jobId, ...data }, token ?? undefined);
    },
    onSuccess: (data) => {
      toast.success("Application submitted successfully!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.applications() });
      setShowInterviewPrompt(data._id);
    },
    onError: (err: any) => {
      toast.error(err.message || "An error occurred");
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resumeUrl) {
      toast.error("Please upload your resume before submitting.");
      return;
    }
    applyMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-background w-full max-w-lg rounded-sm border border-card-border shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-card-border">
          <div>
            <h2 className="text-xl font-serif">Apply for Role</h2>
            <p className="text-sm text-muted">{jobTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {showInterviewPrompt ? (
          <>
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6">
                <FileCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif mb-3">Application Submitted!</h3>
              <p className="text-muted mb-8 max-w-sm">
                Would you like to take the AI interview now to fast-track your application?
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button
                  onClick={() => {
                    onClose();
                    router.push(`/dashboard/interviews?applicationId=${showInterviewPrompt}`);
                  }}
                  className="flex-1 px-6 py-3 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity"
                >
                  Take Interview Now
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-card-border text-sm font-medium uppercase tracking-widest rounded-sm hover:bg-foreground/5 transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-6 overflow-y-auto">
              <form id="apply-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="px-4 py-3 bg-card border border-card-border rounded-sm text-sm">
                  <span className="text-muted text-xs uppercase tracking-widest font-medium">Applying for: </span>
                  <span className="font-medium">{jobTitle}</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest font-medium">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.applicantName}
                    onChange={e => setFormData({ ...formData, applicantName: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-card-border rounded-sm text-sm focus:outline-none focus:border-foreground"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest font-medium">Email *</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-card border border-card-border rounded-sm text-sm focus:outline-none focus:border-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-widest font-medium">Phone *</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-card border border-card-border rounded-sm text-sm focus:outline-none focus:border-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest font-medium">Resume / CV *</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {uploadedFileName ? (
                    <div className="flex items-center justify-between px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-sm text-sm">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400 min-w-0">
                        <FileCheck className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{uploadedFileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setUploadedFileName(null); setFormData(p => ({ ...p, resumeUrl: "" })); fileInputRef.current?.click(); }}
                        className="text-xs text-muted hover:text-foreground ml-2 flex-shrink-0 flex items-center gap-1"
                      >
                        <FileX className="w-3 h-3" /> Replace
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-5 bg-card border border-dashed border-card-border rounded-sm text-sm text-muted hover:border-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    >
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {isUploading ? "Uploading..." : "Click to upload (PDF/DOC, max 5MB)"}
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest font-medium">Cover Letter (Optional)</label>
                  <textarea
                    rows={4}
                    value={formData.coverLetter}
                    onChange={e => setFormData({ ...formData, coverLetter: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-card-border rounded-sm text-sm focus:outline-none focus:border-foreground resize-none"
                  ></textarea>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-card-border bg-card flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-card-border text-sm font-medium uppercase tracking-widest rounded-sm hover:bg-foreground/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="apply-form"
                disabled={applyMutation.isPending || isUploading || !formData.resumeUrl}
                className="px-8 py-3 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center min-w-[140px] disabled:opacity-50"
              >
                {applyMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
