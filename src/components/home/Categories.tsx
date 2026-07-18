"use client";

import Link from "next/link";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/PageMotion";

const CATEGORIES = [
  { name: "Women's", image: "https://i.ibb.co.com/Y7Bgb5Ym/whomens.avif", link: "/collections?category=Women%27s+Clothing" },
  { name: "Men's", image: "https://i.ibb.co.com/tMJzks00/Mens.avif", link: "/collections?category=Men%27s+Clothing" },
  { name: "Accessories", image: "https://i.ibb.co.com/QFdHFC2m/accesory.avif", link: "/collections?category=Accessories" },
  { name: "New Arrivals", image: "https://i.ibb.co.com/sJmwccfz/New.avif", link: "/collections?sort=newest" },
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
              <Link href={cat.link} className="group relative h-[400px] overflow-hidden block rounded-sm hover:shadow-xl transition-shadow duration-[600ms]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[600ms] ease-out transform-gpu"
                />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors duration-[600ms]" />
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
