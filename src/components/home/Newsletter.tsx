"use client";

import { ScrollReveal } from "@/components/ui/PageMotion";

export function Newsletter() {
  return (
    <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-b border-card-border">
      <ScrollReveal>
        <h2 className="text-3xl font-serif mb-4">Join The Club</h2>
        <p className="text-muted mb-10">Subscribe to receive early access to new collections, exclusive events, and editorial content.</p>

        <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email address"
            className="flex-1 px-4 py-3 bg-card border border-card-border focus:outline-none focus:border-accent/60 rounded-sm transition-colors text-sm"
            required
          />
          <button
            type="submit"
            className="px-8 py-3 bg-accent text-pure-white text-sm font-medium uppercase tracking-widest rounded-sm hover:bg-accent-hover transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      </ScrollReveal>
    </section>
  );
}
