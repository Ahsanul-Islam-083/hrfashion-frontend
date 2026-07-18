"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X, User, ShoppingBag, LayoutDashboard, LogOut, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className={`w-8 h-8 ${className}`} />;
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`p-2 rounded-full hover:bg-foreground/10 transition-colors ${className}`}
      aria-label="Toggle theme"
    >
      {theme === "dark"
        ? <Sun className="w-4 h-4" />
        : <Moon className="w-4 h-4" />}
    </button>
  );
}

export function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  }, []);

  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") setIsDropdownOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isDropdownOpen, handleEscape]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/85 backdrop-blur-md border-b border-card-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="text-xl tracking-widest uppercase font-semibold">
              HR Fashion
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center text-sm font-medium tracking-wide">
            <Link href="/" className={`hover:text-muted transition-colors ${pathname === "/" ? "text-accent font-semibold border-b-2 border-accent pb-0.5" : ""}`}>Home</Link>
            <Link href="/collections" className={`hover:text-muted transition-colors ${pathname.startsWith("/collections") ? "text-accent font-semibold border-b-2 border-accent pb-0.5" : ""}`}>Collections</Link>
            <Link href="/about" className={`hover:text-muted transition-colors ${pathname === "/about" ? "text-accent font-semibold border-b-2 border-accent pb-0.5" : ""}`}>About Us</Link>
            <Link href="/careers" className={`hover:text-muted transition-colors ${pathname.startsWith("/careers") ? "text-accent font-semibold border-b-2 border-accent pb-0.5" : ""}`}>Careers</Link>
          </div>

          <div className="hidden md:flex items-center space-x-2 text-sm">
            <ThemeToggle />
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1 pl-1 pr-3 py-1 rounded-full bg-card border border-card-border focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full overflow-hidden text-xs font-medium uppercase">
                    {session.user.image ? (
                      <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{session.user.name?.charAt(0)}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground">{firstName}</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 transition-all duration-200 origin-top-right z-50 pt-2">
                    <div className="py-2 bg-card border border-card-border rounded-sm shadow-xl">
                      <div className="px-4 py-3 border-b border-card-border">
                        <p className="text-sm font-medium text-foreground truncate">{session.user.name}</p>
                        <p className="text-xs text-muted truncate">{session.user.email}</p>
                      </div>
                      <div className="py-1">
                        {session.user.role === "admin" ? (
                          <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:bg-foreground/5 hover:text-foreground transition-colors">
                            <LayoutDashboard className="w-4 h-4" />
                            Admin
                          </Link>
                        ) : (
                          <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:bg-foreground/5 hover:text-foreground transition-colors">
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                        )}
                      </div>
                      <div className="py-1 border-t border-card-border">
                        <button onClick={handleSignOut} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-2">
                <Link href="/login" className="hover:text-muted transition-colors">Login</Link>
                <Link href="/register" className="px-4 py-2 bg-accent text-pure-white text-sm font-medium rounded-sm hover:bg-accent-hover transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button onClick={toggleMenu} className="p-2 text-foreground">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-card-border bg-background"
          >
            <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
              <Link href="/" onClick={toggleMenu} className={`block py-2 text-lg ${pathname === "/" ? "text-accent font-semibold" : ""}`}>Home</Link>
              <Link href="/collections" onClick={toggleMenu} className={`block py-2 text-lg ${pathname.startsWith("/collections") ? "text-accent font-semibold" : ""}`}>Collections</Link>
              <Link href="/careers" onClick={toggleMenu} className={`block py-2 text-lg ${pathname.startsWith("/careers") ? "text-accent font-semibold" : ""}`}>Careers</Link>

              <div className="pt-4 border-t border-card-border flex flex-col gap-4">
                {session ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center text-xl font-medium uppercase overflow-hidden border border-card-border">
                        {session.user.image ? (
                          <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{session.user.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-foreground">{firstName}</p>
                        <p className="text-sm text-muted">{session.user.email}</p>
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-3">
                      {session.user.role === "admin" ? (
                        <Link href="/admin" onClick={toggleMenu} className="flex items-center justify-center gap-2 w-full py-3 bg-card border border-card-border rounded-sm font-medium">
                          <LayoutDashboard className="w-4 h-4" />
                          Admin
                        </Link>
                      ) : (
                        <Link href="/dashboard" onClick={toggleMenu} className="flex items-center justify-center gap-2 w-full py-3 bg-card border border-card-border rounded-sm font-medium">
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                      )}
                      <button onClick={() => { toggleMenu(); handleSignOut(); }} className="flex items-center justify-center gap-2 w-full py-3 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4 pt-2">
                    <Link href="/login" onClick={toggleMenu} className="flex-1 text-center py-3 border border-card-border rounded-sm">Login</Link>
                    <Link href="/register" onClick={toggleMenu} className="flex-1 text-center py-3 bg-accent text-pure-white rounded-sm font-medium">Register</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
