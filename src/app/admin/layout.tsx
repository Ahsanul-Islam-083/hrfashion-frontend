"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Briefcase, FileText, Users, LogOut } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Careers", href: "/admin/careers", icon: Briefcase },
  { name: "Applications", href: "/admin/applications", icon: FileText },
  { name: "Users", href: "/admin/users", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-neutral-50 dark:bg-neutral-950">
      <div className="hidden md:flex w-64 flex-col fixed top-[64px] h-[calc(100vh-64px)] bg-background border-r border-neutral-200 dark:border-neutral-800">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500 mb-1">Admin Panel</p>
          <p className="font-medium text-sm truncate">{session?.user?.name}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors
                  ${isActive ? "bg-neutral-100 dark:bg-neutral-900 text-foreground" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-foreground"}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-foreground" : "text-neutral-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-500 hover:text-foreground transition-colors mb-1">
            ← User Dashboard
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-sm text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="flex-1 md:ml-64 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
