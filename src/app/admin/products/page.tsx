"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, Loader2, Upload, ImageIcon } from "lucide-react";
import { getToken } from "@/lib/auth-client";
import { fetchProducts, createProduct, updateProduct, deleteProduct, type Product } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queryKeys";

const EMPTY: Partial<Product> = {
  title: "", shortDescription: "", fullDescription: "",
  price: 0, category: "", images: [], stock: 0,
  sizes: [], colors: [], featured: false, rating: 0,
};

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [modal, setModal] = useState<{ open: boolean; product: Partial<Product> }>({ open: false, product: EMPTY });
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [sizesRaw, setSizesRaw] = useState("");
  const [colorsRaw, setColorsRaw] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.admin.products(),
    queryFn: () => fetchProducts("limit=200"),
  });

  const withToken = async (fn: (t: string) => Promise<any>) => {
    const token = await getToken();
    if (!token) throw new Error("No token");
    return fn(token);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (imageUrls.length + files.length > 6) {
      toast.error("You can upload a maximum of 6 images.");
      return;
    }
    setIsUploading(true);
    const uploadToast = toast.loading("Uploading images...");
    try {
      const API_KEY = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;
      const uploadPromises = Array.from(files).map(async (file) => {
        if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name} exceeds the 5MB limit.`);
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!data.success) throw new Error(`Failed to upload ${file.name}`);
        return data.data.url as string;
      });
      const uploaded = await Promise.all(uploadPromises);
      setImageUrls((prev) => [...prev, ...uploaded]);
    } catch (err) {
      toast.dismiss(uploadToast);
      toast.error(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      toast.dismiss(uploadToast);
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (product: Partial<Product>) => {
      const payload = {
        ...product,
        images: imageUrls,
        sizes: sizesRaw.split(",").map((s) => s.trim()).filter(Boolean),
        colors: colorsRaw.split(",").map((s) => s.trim()).filter(Boolean),
      };
      
      return withToken((t) => product._id ? updateProduct(product._id!, payload, t) : createProduct(payload as Product, t));
    },
    onSuccess: () => {
      toast.success("Product saved");
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.products() });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.overview() });
      closeModal();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => withToken((t) => deleteProduct(id, t)),
    onSuccess: () => {
      toast.success("Product deleted");
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.products() });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.overview() });
      setConfirmId(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const openModal = (product: Partial<Product> = EMPTY) => {
    setModal({ open: true, product });
    setImageUrls(product.images || []);
    setSizesRaw((product.sizes || []).join(", "));
    setColorsRaw((product.colors || []).join(", "));
  };
  const closeModal = () => { setModal({ open: false, product: EMPTY }); setImageUrls([]); };
  const setField = (k: keyof Product, v: any) => setModal((m) => ({ ...m, product: { ...m.product, [k]: v } }));
  const p = modal.product;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif mb-1">Products</h1>
          <p className="text-muted text-sm">{data?.total ?? 0} total products</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-background rounded-sm border border-card-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-card border-b border-card-border">
              <tr>{["Image", "Title", "Category", "Price", "Stock", "Actions"].map((h) => <th key={h} className="px-5 py-3.5 font-medium uppercase tracking-widest text-xs text-muted">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {isLoading ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">Loading...</td></tr>
              ) : data?.products.map((prod) => (
                <tr key={prod._id} className="hover:bg-foreground/5 transition-colors">
                  <td className="px-5 py-3">
                    {prod.images[0]
                      ? <img src={prod.images[0]} alt={prod.title} className="w-10 h-12 object-cover rounded-sm" />
                      : <div className="w-10 h-12 bg-card rounded-sm flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted" /></div>}
                  </td>
                  <td className="px-5 py-3 font-medium max-w-[180px] truncate">{prod.title}</td>
                  <td className="px-5 py-3 text-muted">{prod.category}</td>
                  <td className="px-5 py-3">${prod.price}</td>
                  <td className="px-5 py-3">{prod.stock}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openModal(prod)} className="p-1.5 border border-transparent hover:border-card-border hover:bg-foreground/10 rounded-sm transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setConfirmId(prod._id)} className="p-1.5 text-red-600 border border-transparent hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-sm transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
          <div className="bg-background w-full max-w-2xl rounded-sm border border-card-border shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-card-border">
              <h2 className="text-xl font-serif">{p._id ? "Edit Product" : "New Product"}</h2>
              <button onClick={closeModal}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest font-medium text-muted">Title</label>
                <input value={p.title || ""} onChange={(e) => setField("title", e.target.value)} className="w-full px-4 py-2.5 bg-card border border-card-border rounded-sm text-sm focus:outline-none focus:border-foreground" />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest font-medium text-muted">Category</label>
                <select value={p.category || ""} onChange={(e) => setField("category", e.target.value)} className="w-full px-4 py-2.5 bg-card border border-card-border rounded-sm text-sm focus:outline-none focus:border-foreground">
                  <option value="" disabled>Select category...</option>
                  <option value="Women's Clothing">Women's Clothing</option>
                  <option value="Men's Clothing">Men's Clothing</option>
                  <option value="Accessories">Accessories</option>
                  <option value="New Arrivals">New Arrivals</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest font-medium text-muted">Price</label>
                  <input type="number" value={p.price || 0} onChange={(e) => setField("price", parseFloat(e.target.value))} className="w-full px-4 py-2.5 bg-card border border-card-border rounded-sm text-sm focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest font-medium text-muted">Stock</label>
                  <input type="number" value={p.stock || 0} onChange={(e) => setField("stock", parseInt(e.target.value))} className="w-full px-4 py-2.5 bg-card border border-card-border rounded-sm text-sm focus:outline-none" />
                </div>
              </div>

              {(["shortDescription", "fullDescription"] as const).map((f) => (
                <div key={f} className="space-y-1">
                  <label className="text-xs uppercase tracking-widest font-medium text-muted capitalize">{f.replace(/([A-Z])/g, " $1")}</label>
                  <textarea rows={f === "fullDescription" ? 4 : 2} value={(p[f] as string) || ""} onChange={(e) => setField(f, e.target.value)} className="w-full px-4 py-2.5 bg-card border border-card-border rounded-sm text-sm focus:outline-none resize-none" />
                </div>
              ))}

              {/* Image Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-widest font-medium text-muted">Images ({imageUrls.length}/6)</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || imageUrls.length >= 6}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-card-border text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-foreground/5 disabled:opacity-50 transition-colors"
                  >
                    {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {isUploading ? "Uploading..." : "Upload"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                {imageUrls.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {imageUrls.map((url, i) => (
                      <div key={i} className="relative group w-20 h-24 flex-shrink-0">
                        <img src={url} alt="" className="w-full h-full object-cover rounded-sm border border-card-border" />
                        <button
                          onClick={() => setImageUrls((prev) => prev.filter((_, j) => j !== i))}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {imageUrls.length < 6 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-20 h-24 flex-shrink-0 border-2 border-dashed border-card-border rounded-sm flex flex-col items-center justify-center gap-1 text-muted hover:border-muted hover:text-muted transition-colors disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-widest">Add</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full h-24 border-2 border-dashed border-card-border rounded-sm flex flex-col items-center justify-center gap-2 text-muted hover:border-muted hover:text-muted transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="text-xs uppercase tracking-widest">Click to upload images (max 6, 5MB each)</span>
                  </button>
                )}
              </div>

              {[{ label: "Sizes (comma-separated)", val: sizesRaw, set: setSizesRaw }, { label: "Colors (comma-separated)", val: colorsRaw, set: setColorsRaw }].map(({ label, val, set }) => (
                <div key={label} className="space-y-1">
                  <label className="text-xs uppercase tracking-widest font-medium text-muted">{label}</label>
                  <input value={val} onChange={(e) => set(e.target.value)} className="w-full px-4 py-2.5 bg-card border border-card-border rounded-sm text-sm focus:outline-none" />
                </div>
              ))}

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={!!p.featured} onChange={(e) => setField("featured", e.target.checked)} className="w-4 h-4" />
                <span className="text-sm font-medium">Featured Product</span>
              </label>
            </div>
            <div className="p-6 border-t border-card-border bg-card flex justify-end gap-3">
              <button onClick={closeModal} className="px-5 py-2.5 border border-card-border text-sm font-medium uppercase tracking-widest rounded-sm hover:bg-foreground/5">Cancel</button>
              <button
                onClick={() => saveMutation.mutate(p)}
                disabled={saveMutation.isPending || isUploading}
                className="px-7 py-2.5 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 flex items-center gap-2 min-w-[100px] justify-center disabled:opacity-60"
              >
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
            <h3 className="font-serif text-lg">Delete Product?</h3>
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
