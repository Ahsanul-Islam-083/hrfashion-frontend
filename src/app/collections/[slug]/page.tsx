"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Star, Heart, Share2, Ruler, Truck } from "lucide-react";
import { ProductCard } from "@/components/cards/ProductCard";

export default function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const { data: session } = useSession();
  
  // Dummy product data
  const product = {
    title: "Linen Blend Blazer",
    price: 120,
    shortDescription: "A minimalist essential crafted from sustainable linen blend.",
    fullDescription: "Elevate your everyday wardrobe with our signature Linen Blend Blazer. Designed for a relaxed yet tailored fit, this versatile piece transitions seamlessly from office to evening. Features include notched lapels, patch pockets, and a single-button closure.",
    category: "Women",
    images: [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Beige", "Charcoal", "Navy"],
    stock: 12,
    rating: 4.8
  };

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const handleWishlist = () => {
    if (!session) {
      alert("Please login to add to wishlist"); // Can be replaced with sonner toast
      return;
    }
    alert("Added to wishlist!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/collections" className="hover:text-foreground transition-colors">Collections</Link>
        <span>/</span>
        <span className="text-foreground">{product.category}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-24">
        {/* Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible md:w-24 flex-shrink-0">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`relative aspect-[3/4] w-20 md:w-full flex-shrink-0 rounded-sm overflow-hidden border ${activeImage === idx ? 'border-foreground' : 'border-transparent opacity-60 hover:opacity-100'} transition-all`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          
          <div className="flex-1 aspect-[3/4] md:aspect-auto md:h-[700px] bg-neutral-100 dark:bg-neutral-900 rounded-sm overflow-hidden relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={product.images[activeImage]} 
              alt={product.title} 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl md:text-4xl font-serif">{product.title}</h1>
            <button onClick={handleWishlist} className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xl font-medium">${product.price}</span>
            <div className="flex items-center gap-1 text-neutral-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
            {product.fullDescription}
          </p>
          
          {/* Colors */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-3">
              <span className="uppercase tracking-widest font-medium">Color</span>
              <span className="text-neutral-500">{selectedColor || "Select color"}</span>
            </div>
            <div className="flex gap-3">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border text-sm rounded-sm transition-colors ${selectedColor === color ? 'border-foreground bg-foreground text-background' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
          
          {/* Sizes */}
          <div className="mb-10">
            <div className="flex justify-between text-sm mb-3">
              <span className="uppercase tracking-widest font-medium">Size</span>
              <button className="text-neutral-500 hover:text-foreground flex items-center gap-1 underline underline-offset-4">
                <Ruler className="w-3 h-3" /> Size Guide
              </button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 border text-sm rounded-sm transition-colors ${selectedSize === size ? 'border-foreground bg-foreground text-background' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <button className="w-full py-4 bg-foreground text-background font-medium uppercase tracking-widest text-sm rounded-sm hover:opacity-90 transition-opacity mb-4">
            Add to Bag
          </button>
          
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-500 py-4 border-t border-neutral-200 dark:border-neutral-800 mt-6">
            <Truck className="w-4 h-4" /> Free shipping on orders over $200
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-24 pt-16 border-t border-neutral-200 dark:border-neutral-800">
        <h2 className="text-2xl font-serif mb-8 text-center">Customer Reviews</h2>
        <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-900/50 rounded-sm border border-neutral-100 dark:border-neutral-800/50">
          <Star className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-700 mb-4" />
          <h3 className="font-medium text-lg mb-2">No reviews yet</h3>
          <p className="text-sm text-neutral-500">Be the first to share your thoughts on this piece.</p>
        </div>
      </div>

      {/* Related Products */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-16">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-serif">You May Also Like</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard 
            _id="related-1"
            title="Ribbed Knit Sweater"
            slug="ribbed-knit-sweater"
            shortDescription="Ultra-soft ribbed knit for effortless layering."
            price={95}
            category="Women"
            images={["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800"]}
            rating={4.9}
          />
          <ProductCard 
            _id="related-2"
            title="Tailored Wide Leg Trousers"
            slug="tailored-wide-leg-trousers"
            shortDescription="Classic tailored trousers with a contemporary wide leg."
            price={130}
            category="Women"
            images={["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800"]}
            rating={4.7}
          />
        </div>
      </div>
    </div>
  );
}
