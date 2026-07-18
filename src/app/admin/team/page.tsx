"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, Loader2, ChevronUp, ChevronDown, Upload } from "lucide-react";
import { getToken } from "@/lib/auth-client";
import { fetchTeam, createTeamMember, updateTeamMember, deleteTeamMember, type TeamMember } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queryKeys";

type MemberForm = Omit<TeamMember, "_id" | "createdAt" | "updatedAt">;

const EMPTY: MemberForm = { name: "", designation: "", description: "", image: "", order: 1 };

export default function AdminTeamPage() {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modal, setModal] = useState<{ open: boolean; member: Partial<TeamMember> }>({ open: false, member: EMPTY });
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: team = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.team(),
    queryFn: fetchTeam,
  });

  const sorted = [...team].sort((a, b) => a.order - b.order);

  const withToken = async (fn: (t: string) => Promise<any>) => {
    const token = await getToken();
    if (!token) throw new Error("No token");
    return fn(token);
  };

  const saveMutation = useMutation({
    mutationFn: async (m: Partial<TeamMember>) =>
      withToken((t) =>
        m._id ? updateTeamMember(m._id!, m as any, t) : createTeamMember(m as any, t)
      ),
    onSuccess: () => {
      toast.success("Team member saved");
      qc.invalidateQueries({ queryKey: QUERY_KEYS.team() });
      setModal({ open: false, member: EMPTY });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => withToken((t) => deleteTeamMember(id, t)),
    onSuccess: () => {
      toast.success("Team member deleted");
      qc.invalidateQueries({ queryKey: QUERY_KEYS.team() });
      setConfirmId(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const swapOrder = async (indexA: number, indexB: number) => {
    const a = sorted[indexA];
    const b = sorted[indexB];
    if (!a || !b) return;
    const token = await getToken();
    if (!token) return;
    try {
      await Promise.all([
        updateTeamMember(a._id, { order: b.order }, token),
        updateTeamMember(b._id, { order: a.order }, token),
      ]);
      qc.invalidateQueries({ queryKey: QUERY_KEYS.team() });
    } catch {
      toast.error("Failed to reorder");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File exceeds 5MB limit");
      return;
    }
    setIsUploading(true);
    const uploadToast = toast.loading("Uploading image...");
    try {
      const API_KEY = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, { method: "POST", body: formData });
      const data = await res.json();
      if (!data.success) throw new Error("Image upload failed");
      setModal((m) => ({ ...m, member: { ...m.member, image: data.data.url } }));
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      toast.dismiss(uploadToast);
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const openModal = (m: Partial<TeamMember> = EMPTY) => setModal({ open: true, member: m });
  const setField = (k: keyof TeamMember, v: any) => setModal((prev) => ({ ...prev, member: { ...prev.member, [k]: v } }));
  const m = modal.member;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif mb-1">Team</h1>
          <p className="text-muted text-sm">{team.length} members configured</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      <div className="bg-background rounded-sm border border-card-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-card border-b border-card-border">
              <tr>
                {["Order", "Image", "Name", "Designation", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3.5 font-medium uppercase tracking-widest text-xs text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {isLoading ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">Loading...</td></tr>
              ) : sorted.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">No team members yet. Add one above.</td></tr>
              ) : sorted.map((member, idx) => (
                <tr key={member._id} className="hover:bg-foreground/5 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        disabled={idx === 0}
                        onClick={() => swapOrder(idx, idx - 1)}
                        className="p-0.5 rounded hover:bg-foreground/5 disabled:opacity-30 transition-colors"
                      ><ChevronUp className="w-3.5 h-3.5" /></button>
                      <button
                        disabled={idx === sorted.length - 1}
                        onClick={() => swapOrder(idx, idx + 1)}
                        className="p-0.5 rounded hover:bg-foreground/5 disabled:opacity-30 transition-colors"
                      ><ChevronDown className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-card">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-serif text-muted">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium max-w-[160px] truncate">{member.name}</td>
                  <td className="px-5 py-3 text-muted max-w-[200px] truncate">{member.designation}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openModal(member)} className="p-1.5 border border-transparent hover:border-card-border hover:bg-foreground/10 rounded-sm transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setConfirmId(member._id)} className="p-1.5 text-red-600 border border-transparent hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-sm transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Member Form Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background w-full max-w-lg rounded-sm border border-card-border shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-card-border">
              <h2 className="text-xl font-serif">{m._id ? "Edit Member" : "New Team Member"}</h2>
              <button onClick={() => setModal({ open: false, member: EMPTY })}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-medium text-muted">Profile Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-card border border-card-border flex-shrink-0">
                    {m.image ? (
                      <img src={m.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted font-serif text-xl">
                        {m.name?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex items-center gap-2 px-4 py-2 border border-card-border text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-foreground/5 transition-colors disabled:opacity-50 w-full justify-center"
                    >
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {isUploading ? "Uploading..." : "Upload Image"}
                    </button>
                    <p className="text-[10px] text-muted uppercase tracking-widest mt-1.5 text-center">Max 5MB</p>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest font-medium text-muted">Name</label>
                <input value={m.name || ""} onChange={(e) => setField("name", e.target.value)} className="w-full px-4 py-2.5 bg-card border border-card-border rounded-sm text-sm focus:outline-none focus:border-foreground" />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest font-medium text-muted">Designation</label>
                <input value={m.designation || ""} onChange={(e) => setField("designation", e.target.value)} className="w-full px-4 py-2.5 bg-card border border-card-border rounded-sm text-sm focus:outline-none focus:border-foreground" />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest font-medium text-muted">Description</label>
                <textarea rows={4} value={m.description || ""} onChange={(e) => setField("description", e.target.value)} className="w-full px-4 py-2.5 bg-card border border-card-border rounded-sm text-sm focus:outline-none focus:border-foreground resize-none" />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest font-medium text-muted">Order</label>
                <input type="number" min={1} value={m.order ?? 1} onChange={(e) => setField("order", parseInt(e.target.value))} className="w-full px-4 py-2.5 bg-card border border-card-border rounded-sm text-sm focus:outline-none" />
              </div>
            </div>
            <div className="p-6 border-t border-card-border bg-card flex justify-end gap-3">
              <button onClick={() => setModal({ open: false, member: EMPTY })} className="px-5 py-2.5 border border-card-border text-sm font-medium uppercase tracking-widest rounded-sm hover:bg-foreground/5">Cancel</button>
              <button onClick={() => saveMutation.mutate(m)} disabled={saveMutation.isPending} className="px-7 py-2.5 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 flex items-center gap-2 min-w-[100px] justify-center">
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background w-full max-w-sm rounded-sm border border-card-border p-6 space-y-4">
            <h3 className="font-serif text-lg">Delete Team Member?</h3>
            <p className="text-sm text-muted">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmId(null)} className="px-5 py-2.5 border border-card-border text-sm font-medium uppercase tracking-widest rounded-sm hover:bg-foreground/5">Cancel</button>
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
