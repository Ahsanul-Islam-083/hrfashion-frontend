"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Menu, X, User, ShoppingBag, LayoutDashboard, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="text-xl tracking-widest uppercase font-semibold">
              HR Fashion
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center text-sm font-medium tracking-wide">
            <Link href="/" className="hover:text-neutral-500 transition-colors">Home</Link>
            <Link href="/collections" className="hover:text-neutral-500 transition-colors">Collections</Link>
            <Link href="/careers" className="hover:text-neutral-500 transition-colors">Careers</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4 text-sm">
            <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </button>
            {session ? (
              <div className="relative group">
                <button className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 text-xs font-medium uppercase overflow-hidden border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 dark:focus:ring-offset-background">
                  {session.user.image ? (
                    <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{session.user.name?.charAt(0)}</span>
                  )}
                </button>
                <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right z-50 pt-2">
                  <div className="py-2 bg-background border border-neutral-200 dark:border-neutral-800 rounded-sm shadow-xl">
                    <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                      <p className="text-sm font-medium text-foreground truncate">{session.user.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{session.user.email}</p>
                    </div>
                    <div className="py-1">
                      {session.user.role === "admin" ? (
                        <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-foreground">
                          <LayoutDashboard className="w-4 h-4" />
                          Admin
                        </Link>
                      ) : (
                        <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-foreground">
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                      )}
                    </div>
                    <div className="py-1 border-t border-neutral-100 dark:border-neutral-800">
                      <button onClick={handleSignOut} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="hover:text-neutral-500 transition-colors">Login</Link>
                <Link href="/register" className="px-4 py-2 bg-foreground text-background rounded-sm hover:opacity-90 transition-opacity">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
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
            className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-background"
          >
            <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
              <Link href="/" onClick={toggleMenu} className="block py-2 text-lg">Home</Link>
              <Link href="/collections" onClick={toggleMenu} className="block py-2 text-lg">Collections</Link>
              <Link href="/careers" onClick={toggleMenu} className="block py-2 text-lg">Careers</Link>
              
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-4">
                {session ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xl font-medium uppercase overflow-hidden border border-neutral-200 dark:border-neutral-700">
                        {session.user.image ? (
                          <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{session.user.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-foreground">{session.user.name}</p>
                        <p className="text-sm text-neutral-500">{session.user.email}</p>
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-3">
                      {session.user.role === "admin" ? (
                        <Link href="/admin" onClick={toggleMenu} className="flex items-center justify-center gap-2 w-full py-3 bg-neutral-100 dark:bg-neutral-900 rounded-sm font-medium">
                          <LayoutDashboard className="w-4 h-4" />
                          Admin
                        </Link>
                      ) : (
                        <Link href="/dashboard" onClick={toggleMenu} className="flex items-center justify-center gap-2 w-full py-3 bg-neutral-100 dark:bg-neutral-900 rounded-sm font-medium">
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
                    <Link href="/login" onClick={toggleMenu} className="flex-1 text-center py-3 border border-foreground rounded-sm">Login</Link>
                    <Link href="/register" onClick={toggleMenu} className="flex-1 text-center py-3 bg-foreground text-background rounded-sm">Register</Link>
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
