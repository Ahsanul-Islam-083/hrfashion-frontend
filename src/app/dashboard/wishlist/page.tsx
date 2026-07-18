"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Heart, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchWishlist, removeFromWishlist } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import { ProductCard } from "@/components/cards/ProductCard";
import { QUERY_KEYS } from "@/lib/queryKeys";

export default function WishlistPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.wishlist(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      try {
        return await fetchWishlist(token);
      } catch (e) {
        // Empty state fallback for unimplemented backend
        return { items: [] };
      }
    }
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      await removeFromWishlist(productId, token);
    },
    onSuccess: () => {
      toast.success("Removed from wishlist");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist() });
    },
    onError: () => {
      toast.error("Failed to remove item");
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif mb-2">My Wishlist</h1>
          <p className="text-muted">Curate your favorite pieces.</p>
        </div>
        <span className="text-sm font-medium uppercase tracking-widest text-muted">
          {data?.items?.length || 0} Items
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-muted" />
        </div>
      ) : data?.items?.length === 0 ? (
        <div className="bg-background rounded-sm border border-card-border p-16 text-center">
          <div className="flex flex-col items-center justify-center">
            <Heart className="w-12 h-12 text-muted mb-4" />
            <p className="text-muted mb-6">Your wishlist is currently empty.</p>
            <Link 
              href="/collections"
              className="px-6 py-3 bg-foreground text-background text-sm font-medium uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity"
            >
              Discover Collections
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.items.map((item) => {
            if (!item.product) return null;
            return (
              <div key={item._id} className="relative group">
                <ProductCard {...item.product} />
                <button
                  onClick={() => removeMutation.mutate(item.product!._id)}
                  disabled={removeMutation.isPending}
                  className="absolute top-4 right-4 p-2 bg-card/80 backdrop-blur-sm rounded-full text-muted hover:text-red-600 dark:hover:text-red-400 hover:bg-card hover:ring-1 hover:ring-red-500/30 transition-all duration-500 opacity-0 group-hover:opacity-100"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
