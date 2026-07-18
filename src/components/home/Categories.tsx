"use client";

import Link from "next/link";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/PageMotion";

const CATEGORIES = [
  { name: "Women's", image: "https://images.unsplash.com/photo-1550614000-4b95d466f28d?auto=format&fit=crop&q=80&w=800", link: "/collections?category=Women%27s+Clothing" },
  { name: "Men's", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800", link: "/collections?category=Men%27s+Clothing" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1509631179647-0c114314058f?auto=format&fit=crop&q=80&w=800", link: "/collections?category=Accessories" },
  { name: "New Arrivals", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800", link: "/collections?sort=newest" },
];

export function Categories() {
  return (
    <section className="py-24 bg-card border-y border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl font-serif mb-4">Shop by Category</h2>
          <p className="text-muted max-w-xl mx-auto">Explore our diverse range of clothing tailored for every occasion and style preference.</p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <StaggerItem key={idx}>
              <Link href={cat.link} className="group relative h-[400px] overflow-hidden block rounded-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors duration-700 ease-out" />
                <div className="absolute inset-0 flex items-end justify-start p-6">
                  <span className="text-white text-xl font-serif tracking-wide">{cat.name}</span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
