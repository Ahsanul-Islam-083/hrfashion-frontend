"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import {
  Factory, Package, Scissors, ShieldCheck, Truck, Globe,
  PenTool, CheckCircle, Wrench, Star, Layers, Box,
} from "lucide-react";
import { getToken } from "@/lib/auth-client";
import { fetchServices, createService, updateService, deleteService, type Service } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queryKeys";

const ICON_OPTIONS = [
  { name: "Package", icon: Package },
  { name: "Truck", icon: Truck },
  { name: "Scissors", icon: Scissors },
  { name: "ShieldCheck", icon: ShieldCheck },
  { name: "Globe", icon: Globe },
  { name: "Factory", icon: Factory },
  { name: "PenTool", icon: PenTool },
  { name: "CheckCircle", icon: CheckCircle },
  { name: "Wrench", icon: Wrench },
  { name: "Star", icon: Star },
  { name: "Layers", icon: Layers },
  { name: "Box", icon: Box },
];

const EMPTY: Partial<Service> = { title: "", description: "", icon: "Package", order: 1 };

export default function AdminServicesPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; service: Partial<Service> }>({ open: false, service: EMPTY });
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const { data: services = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.services(),
    queryFn: fetchServices,
  });

  const sorted = [...services].sort((a, b) => a.order - b.order);

  const withToken = async (fn: (t: string) => Promise<any>) => {
    const token = await getToken();
    if (!token) throw new Error("No token");
    return fn(token);
  };

  const saveMutation = useMutation({
    mutationFn: async (s: Partial<Service>) =>
      withToken((t) =>
        s._id ? updateService(s._id!, s as any, t) : createService(s as any, t)
      ),
    onSuccess: () => {
      toast.success("Service saved");
      qc.invalidateQueries({ queryKey: QUERY_KEYS.services() });
      setModal({ open: false, service: EMPTY });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => withToken((t) => deleteService(id, t)),
    onSuccess: () => {
      toast.success("Service deleted");
      qc.invalidateQueries({ queryKey: QUERY_KEYS.services() });
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
        updateService(a._id, { order: b.order }, token),
        updateService(b._id, { order: a.order }, token),
      ]);
      qc.invalidateQueries({ queryKey: QUERY_KEYS.services() });
    } catch {
      toast.error("Failed to reorder");
    }
  };

  const openModal = (s: Partial<Service> = EMPTY) => setModal({ open: true, service: s });
  const setField = (k: keyof Service, v: any) => setModal((m) => ({ ...m, service: { ...m.service, [k]: v } }));
  const s = modal.service;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif mb-1">Services</h1>
          <p className="text-neutral-500 text-sm">{services.length} services configured</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="bg-background rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                {["Order", "Icon", "Title", "Description", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3.5 font-medium uppercase tracking-widest text-xs text-neutral-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {isLoading ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-neutral-500">Loading...</td></tr>
              ) : sorted.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-neutral-500">No services yet. Add one above.</td></tr>
              ) : sorted.map((svc, idx) => {
                const IconComp = ICON_OPTIONS.find((o) => o.name === svc.icon)?.icon ?? Wrench;
                return (
                  <tr key={svc._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex flex-col gap-0.5">
                        <button
                          disabled={idx === 0}
                          onClick={() => swapOrder(idx, idx - 1)}
                          className="p-0.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 transition-colors"
                        ><ChevronUp className="w-3.5 h-3.5" /></button>
                        <button
                          disabled={idx === sorted.length - 1}
                          onClick={() => swapOrder(idx, idx + 1)}
                          className="p-0.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 transition-colors"
                        ><ChevronDown className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="w-9 h-9 bg-foreground text-background flex items-center justify-center rounded-sm">
                        <IconComp className="w-4 h-4" />
                      </div>
                    </td>
                    <td className="px-5 py-3 font-medium max-w-[160px] truncate">{svc.title}</td>
                    <td className="px-5 py-3 text-neutral-500 max-w-[240px] truncate">{svc.description}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openModal(svc)} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-sm transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setConfirmId(svc._id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-sm transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Form Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background w-full max-w-lg rounded-sm border border-neutral-200 dark:border-neutral-800 shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xl font-serif">{s._id ? "Edit Service" : "New Service"}</h2>
              <button onClick={() => setModal({ open: false, service: EMPTY })}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest font-medium text-neutral-500">Title</label>
                <input value={s.title || ""} onChange={(e) => setField("title", e.target.value)} className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground" />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest font-medium text-neutral-500">Description</label>
                <textarea rows={3} value={s.description || ""} onChange={(e) => setField("description", e.target.value)} className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground resize-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest font-medium text-neutral-500">Icon</label>
                <div className="grid grid-cols-4 gap-2">
                  {ICON_OPTIONS.map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setField("icon", name)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-sm border text-xs transition-colors ${s.icon === name ? "border-foreground bg-foreground text-background" : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="truncate w-full text-center">{name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest font-medium text-neutral-500">Order</label>
                <input type="number" value={s.order ?? 1} onChange={(e) => setField("order", parseInt(e.target.value))} className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none" />
              </div>
            </div>
            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex justify-end gap-3">
              <button onClick={() => setModal({ open: false, service: EMPTY })} className="px-5 py-2.5 border border-neutral-200 dark:border-neutral-800 text-sm font-medium uppercase tracking-widest rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-900">Cancel</button>
              <button onClick={() => saveMutation.mutate(s)} disabled={saveMutation.isPending} className="px-7 py-2.5 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 flex items-center gap-2 min-w-[100px] justify-center">
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background w-full max-w-sm rounded-sm border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <h3 className="font-serif text-lg">Delete Service?</h3>
            <p className="text-sm text-neutral-500">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmId(null)} className="px-5 py-2.5 border border-neutral-200 dark:border-neutral-800 text-sm font-medium uppercase tracking-widest rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-900">Cancel</button>
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
