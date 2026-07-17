"use client";


export function Newsletter() {
  return (
    <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-b border-neutral-200 dark:border-neutral-800">
      <h2 className="text-3xl font-serif mb-4">Join The Club</h2>
      <p className="text-neutral-500 mb-10">Subscribe to receive early access to new collections, exclusive events, and editorial content.</p>
      
      <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-4" onSubmit={(e) => e.preventDefault()}>
        <input 
          type="email" 
          placeholder="Email address" 
          className="flex-1 px-4 py-3 bg-transparent border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:border-foreground rounded-sm transition-colors text-sm"
          required
        />
        <button 
          type="submit" 
          className="px-8 py-3 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}
