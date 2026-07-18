"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { fetchRecommendations } from "@/lib/api";
import { getToken, useSession } from "@/lib/auth-client";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { ProductCard } from "@/components/cards/ProductCard";
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";

export function RecommendationsSection() {
  const { data: session, isPending: isSessionLoading } = useSession();

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.recommendations(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return fetchRecommendations(token);
    },
    enabled: !!session?.user,
  });

  if (isSessionLoading) return null;
  if (!session?.user) return null; // Only show if logged in

  return (
    <div className="py-12 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-2 mb-8">
        <h2 className="text-2xl font-serif">Recommended For You</h2>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-[10px] font-medium uppercase tracking-widest">
          <Sparkles className="w-3 h-3" /> Powered by AI
        </span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : isError || !data ? (
        <div className="p-8 text-center text-neutral-500 bg-neutral-50 dark:bg-neutral-900/50 rounded-sm">
          Failed to load recommendations. Please try again later.
        </div>
      ) : data.reason === "empty_wishlist" ? (
        <div className="p-12 text-center flex flex-col items-center bg-neutral-50 dark:bg-neutral-900/50 rounded-sm">
          <Sparkles className="w-8 h-8 text-neutral-300 dark:text-neutral-700 mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Add items to your wishlist to get personalized recommendations!
          </p>
          <Link
            href="/collections"
            className="flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity"
          >
            Explore Collections <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : data.recommendations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.recommendations.map((rec) => (
            <div key={rec.product._id} className="flex flex-col h-full">
              <div className="flex-1">
                <ProductCard {...rec.product} />
              </div>
              <p className="mt-3 text-xs italic text-neutral-500 text-center px-2">
                &ldquo;{rec.reason}&rdquo;
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-neutral-500 bg-neutral-50 dark:bg-neutral-900/50 rounded-sm">
          No new recommendations found at this time. Check back later!
        </div>
      )}
    </div>
  );
}
