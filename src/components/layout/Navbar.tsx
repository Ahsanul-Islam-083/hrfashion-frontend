"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Menu, X, User, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

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
            {session ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="hover:text-neutral-500 transition-colors">Dashboard</Link>
                {session.user.role === "admin" && (
                  <Link href="/admin" className="hover:text-neutral-500 transition-colors">Admin</Link>
                )}
                <button className="flex items-center gap-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                  <User className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="hover:text-neutral-500 transition-colors">Login</Link>
                <Link href="/register" className="px-4 py-2 bg-foreground text-background rounded-sm hover:opacity-90 transition-opacity">
                  Register
                </Link>
              </div>
            )}
            <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </button>
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
                  <>
                    <Link href="/dashboard" onClick={toggleMenu} className="block py-2 text-lg">Dashboard</Link>
                    {session.user.role === "admin" && (
                      <Link href="/admin" onClick={toggleMenu} className="block py-2 text-lg">Admin</Link>
                    )}
                  </>
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
