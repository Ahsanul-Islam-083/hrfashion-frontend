"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName] = useState(session?.user?.name || "");
  const [avatar, setAvatar] = useState(session?.user?.image || "");
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    try {
      const { error } = await authClient.updateUser({
        name,
        image: avatar || undefined
      });
      if (error) {
        toast.error(error.message || "Failed to update profile");
      } else {
        toast.success("Profile updated successfully");
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    try {
      const { error } = await authClient.changePassword({
        newPassword,
        currentPassword,
        revokeOtherSessions: true
      });
      if (error) {
        toast.error(error.message || "Failed to update password");
      } else {
        toast.success("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-3xl font-serif mb-2">Settings</h1>
        <p className="text-neutral-500">Manage your account preferences and security.</p>
      </div>

      <div className="space-y-12">
        {/* Profile Settings */}
        <section>
          <h2 className="text-lg font-medium mb-6 uppercase tracking-widest">Profile Details</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest font-medium text-neutral-500">Email Address (Read-only)</label>
              <input 
                type="email" 
                disabled
                value={session?.user?.email || ""}
                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm text-neutral-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest font-medium text-neutral-500">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest font-medium text-neutral-500">Avatar URL</label>
              <input 
                type="url" 
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <button 
              type="submit"
              disabled={isProfileLoading}
              className="px-8 py-3 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center min-w-[160px]"
            >
              {isProfileLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
            </button>
          </form>
        </section>

        <hr className="border-neutral-200 dark:border-neutral-800" />

        {/* Security Settings */}
        <section>
          <h2 className="text-lg font-medium mb-6 uppercase tracking-widest">Security</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest font-medium text-neutral-500">Current Password</label>
              <input 
                type="password" 
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest font-medium text-neutral-500">New Password</label>
              <input 
                type="password" 
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <button 
              type="submit"
              disabled={isPasswordLoading || !currentPassword || !newPassword}
              className="px-8 py-3 border border-neutral-200 dark:border-neutral-800 text-sm font-medium uppercase tracking-widest rounded-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center min-w-[180px]"
            >
              {isPasswordLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
