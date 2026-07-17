"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { getToken } from "@/lib/auth-client";
import { fetchCareersAdmin, createJob, updateJob, deleteJob, type Job } from "@/lib/api";

const EMPTY: Partial<Job> = { title: "", department: "", location: "", type: "full-time", description: "", requirements: [], status: "open" };

export default function AdminCareersPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; job: Partial<Job> }>({ open: false, job: EMPTY });
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [reqRaw, setReqRaw] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-careers"],
    queryFn: async () => { const t = await getToken(); if (!t) throw new Error("No token"); return fetchCareersAdmin(t); },
  });

  const withToken = async (fn: (t: string) => Promise<any>) => { const t = await getToken(); if (!t) throw new Error("No token"); return fn(t); };

  const saveMutation = useMutation({
    mutationFn: async (job: Partial<Job>) => {
      const payload = { ...job, requirements: reqRaw.split("\n").map(s => s.trim()).filter(Boolean) };
      return withToken(t => job._id ? updateJob(job._id!, payload, t) : createJob(payload, t));
    },
    onSuccess: () => { toast.success("Job saved"); qc.invalidateQueries({ queryKey: ["admin-careers"] }); closeModal(); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => withToken(t => deleteJob(id, t)),
    onSuccess: () => { toast.success("Job deleted"); qc.invalidateQueries({ queryKey: ["admin-careers"] }); setConfirmId(null); },
    onError: (e: any) => toast.error(e.message),
  });

  const toggleStatus = async (job: Job) => {
    try {
      const t = await getToken();
      if (!t) throw new Error("No token");
      await updateJob(job._id, { status: job.status === "open" ? "closed" : "open" }, t);
      toast.success(`Job ${job.status === "open" ? "closed" : "reopened"}`);
      qc.invalidateQueries({ queryKey: ["admin-careers"] });
    } catch (e: any) { toast.error(e.message); }
  };

  const openModal = (job: Partial<Job> = EMPTY) => { setModal({ open: true, job }); setReqRaw((job.requirements || []).join("\n")); };
  const closeModal = () => setModal({ open: false, job: EMPTY });
  const setField = (k: keyof Job, v: any) => setModal(m => ({ ...m, job: { ...m.job, [k]: v } }));
  const j = modal.job;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif mb-1">Careers</h1>
          <p className="text-neutral-500 text-sm">{data?.total ?? 0} total job listings</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Job
        </button>
      </div>

      <div className="bg-background rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
              <tr>{["Title", "Department", "Location", "Type", "Status", "Actions"].map(h => <th key={h} className="px-5 py-3.5 font-medium uppercase tracking-widest text-xs text-neutral-500">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {isLoading ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-neutral-500">Loading...</td></tr>
              ) : data?.jobs.map(job => (
                <tr key={job._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                  <td className="px-5 py-3 font-medium max-w-[180px] truncate">{job.title}</td>
                  <td className="px-5 py-3 text-neutral-500">{job.department}</td>
                  <td className="px-5 py-3 text-neutral-500">{job.location}</td>
                  <td className="px-5 py-3 text-neutral-500 capitalize">{job.type.replace("-", " ")}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest ${job.status === "open" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-neutral-100 text-neutral-500 dark:bg-neutral-900"}`}>{job.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleStatus(job)} title={job.status === "open" ? "Close job" : "Reopen job"} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-sm transition-colors">
                        {job.status === "open" ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4 text-neutral-400" />}
                      </button>
                      <button onClick={() => openModal(job)} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-sm"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setConfirmId(job._id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-sm"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background w-full max-w-2xl rounded-sm border border-neutral-200 dark:border-neutral-800 shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xl font-serif">{j._id ? "Edit Job" : "New Job"}</h2>
              <button onClick={closeModal}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              {(["title", "department", "location"] as const).map(f => (
                <div key={f} className="space-y-1">
                  <label className="text-xs uppercase tracking-widest font-medium text-neutral-500 capitalize">{f}</label>
                  <input value={(j[f] as string) || ""} onChange={e => setField(f, e.target.value)} className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground" />
                </div>
              ))}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest font-medium text-neutral-500">Type</label>
                <select value={j.type || "full-time"} onChange={e => setField("type", e.target.value)} className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none">
                  {["full-time", "part-time", "internship", "contract"].map(t => <option key={t} value={t}>{t.replace("-", " ")}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest font-medium text-neutral-500">Description</label>
                <textarea rows={4} value={j.description || ""} onChange={e => setField("description", e.target.value)} className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none resize-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest font-medium text-neutral-500">Requirements (one per line)</label>
                <textarea rows={5} value={reqRaw} onChange={e => setReqRaw(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none resize-none" />
              </div>
            </div>
            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex justify-end gap-3">
              <button onClick={closeModal} className="px-5 py-2.5 border border-neutral-200 dark:border-neutral-800 text-sm font-medium uppercase tracking-widest rounded-sm">Cancel</button>
              <button onClick={() => saveMutation.mutate(j)} disabled={saveMutation.isPending} className="px-7 py-2.5 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 flex items-center gap-2 min-w-[100px] justify-center">
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background w-full max-w-sm rounded-sm border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <h3 className="font-serif text-lg">Delete Job?</h3>
            <p className="text-sm text-neutral-500">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmId(null)} className="px-5 py-2.5 border border-neutral-200 dark:border-neutral-800 text-sm font-medium uppercase tracking-widest rounded-sm">Cancel</button>
              <button onClick={() => deleteMutation.mutate(confirmId!)} disabled={deleteMutation.isPending} className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium uppercase tracking-widest rounded-sm hover:bg-red-700 flex items-center gap-2 min-w-[90px] justify-center">
                {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
