"use client";

import { Suspense, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ShieldMinus, Trash2 } from "lucide-react";
import { useSession, getToken } from "@/lib/auth-client";
import { fetchUsers, updateUserRole, deleteUser } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queryKeys";

function UsersContent() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(key, value) : params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.admin.users(searchParams.toString()),
    queryFn: async () => { const t = await getToken(); if (!t) throw new Error("No token"); return fetchUsers(t, searchParams.toString()); },
  });

  const withToken = async (fn: (t: string) => Promise<any>) => { const t = await getToken(); if (!t) throw new Error("No token"); return fn(t); };

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => { setPendingId(id); return withToken(t => updateUserRole(id, role, t)); },
    onSuccess: (updated) => { toast.success(`Role updated to ${updated.role}`); qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.users() }); qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.overview() }); setPendingId(null); },
    onError: (e: any) => { toast.error(e.message); setPendingId(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => withToken(t => deleteUser(id, t)),
    onSuccess: () => { toast.success("User deleted"); qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.users() }); qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.overview() }); setConfirmId(null); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif mb-1">Users</h1>
        <p className="text-neutral-500 text-sm">{data?.total ?? 0} registered users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          placeholder="Search name or email..."
          defaultValue={searchParams.get("search") || ""}
          onKeyDown={e => { if (e.key === "Enter") updateParam("search", (e.target as HTMLInputElement).value || null); }}
          className="flex-1 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground"
        />
        <select value={searchParams.get("role") || ""} onChange={e => updateParam("role", e.target.value || null)} className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none">
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="bg-background rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
              <tr>{["User", "Email", "Role", "Joined", "Actions"].map(h => <th key={h} className="px-5 py-3.5 font-medium uppercase tracking-widest text-xs text-neutral-500">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {isLoading ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-neutral-500">Loading...</td></tr>
              ) : data?.users.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-16 text-center text-neutral-500">No users found.</td></tr>
              ) : data?.users.map(user => {
                const isSelf = session?.user?.id === user.id;
                return (
                  <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs font-medium uppercase overflow-hidden">
                          {user.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : user.name?.charAt(0)}
                        </div>
                        <span className="font-medium">{user.name}</span>
                        {isSelf && <span className="text-[10px] uppercase tracking-widest text-neutral-500">(You)</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-neutral-500">{user.email}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest ${user.role === "admin" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-neutral-100 text-neutral-500 dark:bg-neutral-900"}`}>{user.role}</span>
                    </td>
                    <td className="px-5 py-3 text-neutral-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          disabled={isSelf || pendingId === user.id}
                          onClick={() => roleMutation.mutate({ id: user.id, role: user.role === "admin" ? "user" : "admin" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-200 dark:border-neutral-800 rounded-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-50 transition-colors"
                          title={user.role === "admin" ? "Demote to user" : "Promote to admin"}
                        >
                          {pendingId === user.id ? <Loader2 className="w-3 h-3 animate-spin" /> : user.role === "admin" ? <ShieldMinus className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                          {user.role === "admin" ? "Make User" : "Make Admin"}
                        </button>
                        <button
                          disabled={isSelf}
                          onClick={() => setConfirmId(user.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-sm transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background w-full max-w-sm rounded-sm border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <h3 className="font-serif text-lg">Delete User?</h3>
            <p className="text-sm text-neutral-500">This is permanent and will remove all their data.</p>
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

export default function AdminUsersPage() {
  return <Suspense fallback={<div className="text-neutral-500">Loading...</div>}><UsersContent /></Suspense>;
}
