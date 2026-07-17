"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/cards/ProductCard";
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";

// Dummy fetch function - would hit real API
const fetchProducts = async (params: URLSearchParams) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Dummy data
  return {
    data: Array(8).fill(0).map((_, i) => ({
      _id: `prod-${i}`,
      title: `Premium Garment ${i + 1}`,
      slug: `premium-garment-${i + 1}`,
      shortDescription: "A minimalist essential crafted from sustainable materials for everyday wear.",
      price: 85 + (i * 15),
      category: i % 2 === 0 ? "Women" : "Men",
      images: ["https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800"],
      rating: 4.8
    })),
    meta: {
      total: 32,
      page: parseInt(params.get("page") || "1"),
      totalPages: 4
    }
  };
};

function CollectionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["products", searchParams.toString()],
    queryFn: () => fetchProducts(searchParams),
  });

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to page 1 if changing filters
    if (key !== "page") {
      params.set("page", "1");
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-serif mb-2">Collections</h1>
          <p className="text-neutral-500">Explore our curated selection of premium garments.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="relative w-full md:w-auto flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search collections..." 
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none focus:border-foreground transition-colors"
            defaultValue={searchParams.get("q") || ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateParam("q", e.currentTarget.value);
              }
            }}
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors md:hidden"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          
          <select 
            className="px-4 py-2 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none ml-auto"
            value={searchParams.get("sort") || ""}
            onChange={(e) => updateParam("sort", e.target.value)}
          >
            <option value="">Sort: Featured</option>
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`md:w-64 flex-shrink-0 ${isFiltersOpen ? "block" : "hidden md:block"}`}>
          <div className="space-y-8 sticky top-24">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-widest mb-4">Category</h3>
              <div className="space-y-2">
                {["All", "Women", "Men", "Accessories"].map(cat => {
                  const val = cat.toLowerCase();
                  const isActive = (searchParams.get("category") || "all") === val;
                  return (
                    <button 
                      key={cat}
                      className={`block text-sm ${isActive ? "text-foreground font-medium" : "text-neutral-500 hover:text-foreground"}`}
                      onClick={() => updateParam("category", val === "all" ? null : val)}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium uppercase tracking-widest mb-4">Price Range</h3>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none"
                  value={searchParams.get("minPrice") || ""}
                  onChange={(e) => updateParam("minPrice", e.target.value || null)}
                />
                <span className="text-neutral-400">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm text-sm focus:outline-none"
                  value={searchParams.get("maxPrice") || ""}
                  onChange={(e) => updateParam("maxPrice", e.target.value || null)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : data?.data.length === 0 ? (
            <div className="text-center py-24 text-neutral-500">
              No products found matching your criteria.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data?.data.map((product) => (
                  <ProductCard key={product._id} {...product} />
                ))}
              </div>
              
              {/* Pagination */}
              {data?.meta && data.meta.totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-2">
                  <button 
                    disabled={data.meta.page <= 1}
                    onClick={() => updateParam("page", (data.meta.page - 1).toString())}
                    className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-sm disabled:opacity-50 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium px-4">
                    Page {data.meta.page} of {data.meta.totalPages}
                  </span>
                  <button 
                    disabled={data.meta.page >= data.meta.totalPages}
                    onClick={() => updateParam("page", (data.meta.page + 1).toString())}
                    className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-sm disabled:opacity-50 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center">Loading collections...</div>}>
      <CollectionsContent />
    </Suspense>
  );
}
