"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ui/PageMotion";

export function CallToAction() {
  return (
    <section className="py-24 bg-ink text-bone relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Join The Team</h2>
          <p className="text-bone/60 mb-10 text-lg max-w-2xl mx-auto">
            We are always looking for creative, passionate individuals to shape the future of HR Fashion. Discover your next career move with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/careers"
              className="px-8 py-4 bg-accent text-pure-white font-medium uppercase tracking-widest text-sm rounded-sm hover:bg-accent-hover transition-colors"
            >
              View Openings
            </Link>
            <Link
              href="/collections"
              className="px-8 py-4 bg-transparent border border-bone/30 text-bone font-medium uppercase tracking-widest text-sm rounded-sm hover:bg-bone/10 transition-colors"
            >
              Shop Collection
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* Abstract background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      </div>
    </section>
  );
}
