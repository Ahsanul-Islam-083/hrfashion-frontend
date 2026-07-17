import Link from "next/link";

const CATEGORIES = [
  { name: "Women", image: "https://images.unsplash.com/photo-1550614000-4b95d466f28d?auto=format&fit=crop&q=80&w=800", link: "/collections?category=women" },
  { name: "Men", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800", link: "/collections?category=men" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1509631179647-0c114314058f?auto=format&fit=crop&q=80&w=800", link: "/collections?category=accessories" },
  { name: "New Arrivals", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800", link: "/collections?sort=newest" },
];

export function Categories() {
  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif mb-4">Shop by Category</h2>
          <p className="text-neutral-500 max-w-xl mx-auto">Explore our diverse range of clothing tailored for every occasion and style preference.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <Link key={idx} href={cat.link} className="group relative h-[400px] overflow-hidden block rounded-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-2xl font-serif tracking-wide">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
