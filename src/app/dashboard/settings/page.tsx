"use client";

import { useState, useRef } from "react";
import { Loader2, Upload, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName] = useState(session?.user?.name || "");
  const [avatar, setAvatar] = useState(session?.user?.image || "");
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File exceeds the 5MB limit.");
      return;
    }
    
    setIsUploading(true);
    const uploadToast = toast.loading("Uploading image...");
    try {
      const API_KEY = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;
      const formData = new FormData();
      formData.append("image", file);
      
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (!data.success) throw new Error("Failed to upload image");
      
      const uploadedUrl = data.data.url;
      setAvatar(uploadedUrl);
      
      const { error } = await authClient.updateUser({ image: uploadedUrl });
      if (error) throw new Error(error.message || "Failed to update profile image");
      
      toast.success("Profile image updated");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Image upload failed.");
    } finally {
      toast.dismiss(uploadToast);
      setIsUploading(false);
      e.target.value = "";
    }
  };

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
              <label className="text-xs uppercase tracking-widest font-medium text-neutral-500">Avatar Image</label>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex-shrink-0">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 font-serif text-2xl">
                      {name.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-neutral-200 dark:border-neutral-800 text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors disabled:opacity-50 w-full sm:w-auto"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isUploading ? "Uploading..." : "Upload New Image"}
                  </button>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Max 5MB. JPEG or PNG.</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
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
              <div className="relative">
                <input 
                  type={showCurrentPassword ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-foreground transition-colors p-1"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest font-medium text-neutral-500">New Password</label>
              <div className="relative">
                <input 
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-foreground transition-colors p-1"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
