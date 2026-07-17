export function Testimonials() {
  const testimonials = [
    {
      quote: "The attention to detail and fabric quality is simply unmatched. HR Fashion has redefined my wardrobe.",
      author: "Sarah Jenkins",
      role: "Creative Director"
    },
    {
      quote: "Minimalist, elegant, and perfectly tailored. Their pieces always make me feel confident.",
      author: "Michael Chen",
      role: "Architect"
    },
    {
      quote: "I love the editorial aesthetic. Every collection feels curated and timeless.",
      author: "Elena Rossi",
      role: "Fashion Blogger"
    }
  ];

  return (
    <section className="py-24 bg-foreground text-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-sm tracking-widest uppercase mb-16 text-neutral-400">What Our Clients Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((t, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <p className="text-lg font-serif italic mb-6 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-auto">
                <p className="font-medium text-sm">{t.author}</p>
                <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
