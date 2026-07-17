import Link from "next/link";

export function CallToAction() {
  return (
    <section className="py-24 bg-neutral-900 text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-serif mb-6">Join The Team</h2>
        <p className="text-neutral-400 mb-10 text-lg max-w-2xl mx-auto">
          We are always looking for creative, passionate individuals to shape the future of HR Fashion. Discover your next career move with us.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/careers" 
            className="px-8 py-4 bg-white text-neutral-900 font-medium uppercase tracking-widest text-sm rounded-sm hover:bg-neutral-100 transition-colors"
          >
            View Openings
          </Link>
          <Link 
            href="/collections" 
            className="px-8 py-4 bg-transparent border border-white font-medium uppercase tracking-widest text-sm rounded-sm hover:bg-white/10 transition-colors"
          >
            Shop Collection
          </Link>
        </div>
      </div>
      
      {/* Abstract geometric background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      </div>
    </section>
  );
}
