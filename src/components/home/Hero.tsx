import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-neutral-100 dark:bg-neutral-900">
      {/* Background image overlay would go here. For now using a clean solid block to fit the minimalist theme */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10">
        <h1 className="text-[20vw] font-bold tracking-tighter whitespace-nowrap text-neutral-900 dark:text-white select-none">
          HR FASHION
        </h1>
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto flex flex-col items-center">
        <span className="text-sm font-medium tracking-widest uppercase mb-4 block">New Season</span>
        <h2 className="text-5xl md:text-7xl font-serif font-medium tracking-tight mb-6 leading-tight">
          Redefining <br/> Modern Elegance
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
          Discover the latest collection of premium garments designed for the contemporary lifestyle.
        </p>
        <Link 
          href="/collections" 
          className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-medium tracking-wide rounded-sm hover:opacity-90 transition-opacity"
        >
          Explore Collection
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
