"use client";

import Link from "next/link";
import { Star } from "lucide-react";

interface ProductCardProps {
  _id: string;
  title: string;
  shortDescription: string;
  price: number;
  category: string;
  images: string[];
  rating: number;
  featured?: boolean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${
            star <= Math.round(rating)
              ? "fill-accent text-accent"
              : "fill-transparent text-muted"
          }`}
        />
      ))}
      <span className="text-xs text-muted ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export function ProductCard({
  _id,
  title,
  shortDescription,
  price,
  images,
  rating,
  featured,
}: ProductCardProps) {
  return (
    <div className="group flex flex-col bg-card rounded-sm border border-card-border overflow-hidden hover:shadow-xl transition-shadow duration-[600ms]">
      {/* Image container */}
      <Link href={`/collections/${_id}`} className="block relative aspect-[3/4] bg-background overflow-hidden">
        {/* Featured ribbon */}
        {featured && (
          <div className="absolute top-3 left-0 z-10 bg-accent text-pure-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-r-sm shadow-sm">
            Featured
          </div>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[0] || "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800"}
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[600ms] ease-out transform-gpu"
        />

        {/* Hover overlay with View Details CTA */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[600ms] flex items-end justify-center pb-6">
          <span className="px-5 py-2.5 bg-pure-white text-ink text-xs font-semibold uppercase tracking-widest rounded-sm transform translate-y-3 group-hover:translate-y-0 duration-[600ms] hover:opacity-90 transition-opacity">
            View Details
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-1.5">
          <h3 className="font-serif text-base leading-snug line-clamp-1 text-foreground">{title}</h3>
          <p className="text-xs text-muted mt-0.5 line-clamp-1">{shortDescription}</p>
        </div>

        <div className="mt-3 pt-3 border-t border-card-border flex items-center justify-between">
          <StarRating rating={rating} />
          <span className="text-sm font-semibold text-accent">${price}</span>
        </div>
      </div>
    </div>
  );
}
