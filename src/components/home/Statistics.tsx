"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const STATS = [
  { label: "Years of Craftsmanship", value: "15+" },
  { label: "Unique Collections", value: "50+" },
  { label: "Happy Customers", value: "100k+" },
  { label: "Countries Served", value: "30+" },
];

export function Statistics() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-24 border-y border-neutral-200 dark:border-neutral-800" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {STATS.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-serif mb-4 text-neutral-900 dark:text-neutral-100">{stat.value}</div>
              <div className="text-sm tracking-widest uppercase text-neutral-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
