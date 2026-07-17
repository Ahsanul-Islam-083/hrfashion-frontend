import Link from "next/link";
import { Star } from "lucide-react";

interface ProductCardProps {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  price: number;
  category: string;
  images: string[];
  rating: number;
}

export function ProductCard({
  title,
  slug,
  shortDescription,
  price,
  images,
  rating,
}: ProductCardProps) {
  return (
    <div className="group flex flex-col bg-background rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
      <Link href={`/collections/${slug}`} className="block relative aspect-[3/4] bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[0] || "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800"}
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </Link>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
          <span className="font-medium text-sm ml-2">${price}</span>
        </div>
        
        <p className="text-xs text-neutral-500 mb-4 line-clamp-2 flex-1">
          {shortDescription}
        </p>
        
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-1 text-neutral-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs">{rating.toFixed(1)}</span>
          </div>
          <Link 
            href={`/collections/${slug}`}
            className="text-xs font-medium uppercase tracking-widest hover:text-neutral-500 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
