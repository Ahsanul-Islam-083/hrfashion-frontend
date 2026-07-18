

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const HERO_IMAGES = [
  "/Hero1.jpg",
  "/Hero2.jpg",
  "/Hero3.jpg",
  "/Hero4.jpg",
  "/Hero5.jpg",
];

export function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-card">
      {/* Background image carousel — layered images, opacity-controlled crossfade */}
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((src, i) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: i === current ? 1 : 0,
              scale: i === current ? 1.08 : 1,
            }}
            transition={{
              opacity: { duration: 1.2, ease: "easeInOut" },
              scale: { duration: 6, ease: "linear" },
            }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
          </motion.div>
        ))}
      </div>

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-ink/80 via-ink/50 to-ink/70" />

      <div className="relative z-20 text-center px-4 max-w-3xl mx-auto flex flex-col items-center">
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
          className="text-5xl md:text-7xl font-serif font-medium tracking-tight mb-6 leading-tight text-white"
        >
          Redefining <br /> Modern Elegance
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16, ease: "easeOut" }}
          className="text-white/80 mb-10 max-w-lg mx-auto text-lg leading-relaxed"
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