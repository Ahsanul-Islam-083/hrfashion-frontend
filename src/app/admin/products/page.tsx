"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, Loader2 } from "lucide-react";
import { getToken } from "@/lib/auth-client";
import { fetchProducts, createProduct, updateProduct, deleteProduct, type Product } from "@/lib/api";

const EMPTY: Partial<Product> = { title: "", slug: "", shortDescription: "", fullDescription: "", price: 0, category: "", images: [], stock: 0, sizes: [], colors: [], featured: false, rating: 0 };

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; product: Partial<Product> }>({ open: false, product: EMPTY });
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [imagesRaw, setImagesRaw] = useState("");
  const [sizesRaw, setSizesRaw] = useState("");
  const [colorsRaw, setColorsRaw] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => fetchProducts("limit=200"),
  });

  const withToken = async (fn: (t: string) => Promise<any>) => {
    const token = await getToken();
    if (!token) throw new Error("No token");
    return fn(token);
  };

  const saveMutation = useMutation({
    mutationFn: async (product: Partial<Product>) => {
      const payload = { ...product, images: imagesRaw.split(",").map(s => s.trim()).filter(Boolean), sizes: sizesRaw.split(",").map(s => s.trim()).filter(Boolean), colors: colorsRaw.split(",").map(s => s.trim()).filter(Boolean) };
      return withToken(t => product._id ? updateProduct(product._id!, payload, t) : createProduct(payload, t));
    },
    onSuccess: () => { toast.success("Product saved"); qc.invalidateQueries({ queryKey: ["admin-products"] }); closeModal(); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => withToken(t => deleteProduct(id, t)),
    onSuccess: () => { toast.success("Product deleted"); qc.invalidateQueries({ queryKey: ["admin-products"] }); setConfirmId(null); },
    onError: (e: any) => toast.error(e.message),
  });

  const openModal = (product: Partial<Product> = EMPTY) => {
    setModal({ open: true, product });
    setImagesRaw((product.images || []).join(", "));
    setSizesRaw((product.sizes || []).join(", "));
    setColorsRaw((product.colors || []).join(", "));
  };
  const closeModal = () => setModal({ open: false, product: EMPTY });
  const setField = (k: keyof Product, v: any) => setModal(m => ({ ...m, product: { ...m.product, [k]: v } }));
  const p = modal.product;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif mb-1">Products</h1>
          <p className="text-neutral-500 text-sm">{data?.total ?? 0} total products</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-background rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
              <tr>{["Image", "Title", "Category", "Price", "Stock", "Actions"].map(h => <th key={h} className="px-5 py-3.5 font-medium uppercase tracking-widest text-xs text-neutral-500">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {isLoading ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-neutral-500">Loading...</td></tr>
              ) : data?.products.map(prod => (
                <tr key={prod._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                  <td className="px-5 py-3">
                    {prod.images[0] ? <img src={prod.images[0]} alt={prod.title} className="w-10 h-12 object-cover rounded-sm" /> : <div className="w-10 h-12 bg-neutral-100 dark:bg-neutral-900 rounded-sm" />}
                  </td>
                  <td className="px-5 py-3 font-medium max-w-[180px] truncate">{prod.title}</td>
                  <td className="px-5 py-3 text-neutral-500">{prod.category}</td>
                  <td className="px-5 py-3">${prod.price}</td>
                  <td className="px-5 py-3">{prod.stock}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openModal(prod)} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-sm transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setConfirmId(prod._id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-sm transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background w-full max-w-2xl rounded-sm border border-neutral-200 dark:border-neutral-800 shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xl font-serif">{p._id ? "Edit Product" : "New Product"}</h2>
              <button onClick={closeModal}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              {(["title", "slug", "category"] as const).map(f => (
                <div key={f} className="space-y-1">
                  <label className="text-xs uppercase tracking-widest font-medium text-neutral-500 capitalize">{f}</label>
                  <input value={(p[f] as string) || ""} onChange={e => setField(f, e.target.value)} className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-xs uppercase tracking-widest font-medium text-neutral-500">Price</label><input type="number" value={p.price || 0} onChange={e => setField("price", parseFloat(e.target.value))} className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none" /></div>
                <div className="space-y-1"><label className="text-xs uppercase tracking-widest font-medium text-neutral-500">Stock</label><input type="number" value={p.stock || 0} onChange={e => setField("stock", parseInt(e.target.value))} className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none" /></div>
              </div>
              {(["shortDescription", "fullDescription"] as const).map(f => (
                <div key={f} className="space-y-1">
                  <label className="text-xs uppercase tracking-widest font-medium text-neutral-500 capitalize">{f.replace(/([A-Z])/g, " $1")}</label>
                  <textarea rows={f === "fullDescription" ? 4 : 2} value={(p[f] as string) || ""} onChange={e => setField(f, e.target.value)} className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none resize-none" />
                </div>
              ))}
              {[{ label: "Images (comma-separated URLs)", val: imagesRaw, set: setImagesRaw }, { label: "Sizes (comma-separated)", val: sizesRaw, set: setSizesRaw }, { label: "Colors (comma-separated)", val: colorsRaw, set: setColorsRaw }].map(({ label, val, set }) => (
                <div key={label} className="space-y-1">
                  <label className="text-xs uppercase tracking-widest font-medium text-neutral-500">{label}</label>
                  <input value={val} onChange={e => set(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none" />
                </div>
              ))}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={!!p.featured} onChange={e => setField("featured", e.target.checked)} className="w-4 h-4" />
                <span className="text-sm font-medium">Featured Product</span>
              </label>
            </div>
            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex justify-end gap-3">
              <button onClick={closeModal} className="px-5 py-2.5 border border-neutral-200 dark:border-neutral-800 text-sm font-medium uppercase tracking-widest rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-900">Cancel</button>
              <button onClick={() => saveMutation.mutate(p)} disabled={saveMutation.isPending} className="px-7 py-2.5 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 flex items-center gap-2 min-w-[100px] justify-center">
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
            <h3 className="font-serif text-lg">Delete Product?</h3>
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
