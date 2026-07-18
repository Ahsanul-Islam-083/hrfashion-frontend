"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-card">
      {/* Background watermark */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.06]">
        <h1 className="text-[20vw] font-bold tracking-tighter whitespace-nowrap text-foreground select-none">
          HR FASHION
        </h1>
      </div>

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-xs font-semibold tracking-[0.3em] uppercase mb-5 text-accent block"
        >
          New Season
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-5xl md:text-7xl font-serif font-medium tracking-tight mb-6 leading-tight"
        >
          Redefining <br /> Modern Elegance
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16, ease: "easeOut" }}
          className="text-muted mb-10 max-w-lg mx-auto text-lg leading-relaxed"
        >
          Discover the latest collection of premium garments designed for the contemporary lifestyle.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24, ease: "easeOut" }}
        >
          <Link
            href="/collections"
            className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-pure-white font-medium tracking-wide rounded-sm hover:bg-accent-hover transition-colors"
          >
            Explore Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
