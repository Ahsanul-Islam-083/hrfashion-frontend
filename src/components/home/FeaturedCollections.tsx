import Link from "next/link";
import { ArrowRight } from "lucide-react";

// In a real app, this would be fetched from /api/products?featured=true
const DUMMY_PRODUCTS = [
  { id: "1", title: "Linen Blend Blazer", price: 120, category: "Women", image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800" },
  { id: "2", title: "Oversized Cotton Shirt", price: 85, category: "Men", image: "https://images.unsplash.com/photo-1596755094514-f87e32f85f98?auto=format&fit=crop&q=80&w=800" },
  { id: "3", title: "Pleated Wide Trousers", price: 95, category: "Women", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800" },
  { id: "4", title: "Merino Wool Knit", price: 110, category: "Men", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800" },
];

export function FeaturedCollections() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-serif mb-3">Featured Pieces</h2>
          <p className="text-neutral-500">Curated selection from our latest arrivals.</p>
        </div>
        <Link href="/collections" className="hidden sm:flex items-center gap-2 text-sm font-medium hover:text-neutral-500 transition-colors uppercase tracking-widest">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {DUMMY_PRODUCTS.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id} className="group block">
            <div className="aspect-[3/4] bg-neutral-100 dark:bg-neutral-900 mb-4 overflow-hidden rounded-sm relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-sm mb-1">{product.title}</h3>
                <p className="text-xs text-neutral-500">{product.category}</p>
              </div>
              <span className="font-medium text-sm">${product.price}</span>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-12 text-center sm:hidden">
        <Link href="/collections" className="inline-flex items-center justify-center w-full py-4 border border-foreground text-sm font-medium uppercase tracking-widest hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
          View All Collection
        </Link>
      </div>
    </section>
  );
}
