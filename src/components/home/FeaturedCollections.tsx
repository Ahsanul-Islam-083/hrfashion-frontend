"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { fetchProducts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/PageMotion";
import { Star } from "lucide-react";

export function FeaturedCollections() {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.products("featured=true&limit=4"),
    queryFn: () => fetchProducts("featured=true&limit=4"),
  });

  const products = data?.products || [];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <ScrollReveal>
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-serif mb-3">Featured Pieces</h2>
            <p className="text-muted">Curated selection from our latest arrivals.</p>
          </div>
          <Link href="/collections" className="hidden sm:flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors uppercase tracking-widest">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </ScrollReveal>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-muted" />
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-muted">Failed to load featured products.</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-muted">No featured products available at the moment.</div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <StaggerItem key={product._id}>
              <Link href={`/collections/${product._id}`} className="group block">
                <div className="aspect-[3/4] bg-card mb-4 overflow-hidden rounded-sm relative border border-card-border group-hover:border-accent/30 transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.images[0] || "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800"}
                    alt={product.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-base mb-0.5 line-clamp-1">{product.title}</h3>
                    <p className="text-xs text-muted">{product.category}</p>
                  </div>
                  <span className="font-semibold text-sm text-accent ml-2 mt-0.5">${product.price}</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-3 h-3 fill-accent text-accent" />
                  <span className="text-xs text-muted">{product.rating?.toFixed(1) ?? "—"}</span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      <div className="mt-12 text-center sm:hidden">
        <Link href="/collections" className="inline-flex items-center justify-center w-full py-4 border border-card-border text-sm font-medium uppercase tracking-widest hover:border-accent/50 transition-colors">
          View All Collection
        </Link>
      </div>
    </section>
  );
}
