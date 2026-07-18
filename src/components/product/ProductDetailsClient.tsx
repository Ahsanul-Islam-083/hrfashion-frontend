"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useSession, getToken } from "@/lib/auth-client";
import { Star, Heart, Ruler, Truck, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { ProductReviews } from "@/components/product/ProductReviews";
import type { Product } from "@/lib/api";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [[activeImage, direction], setSlide] = useState([0, 0]);
  const dragStart = useRef<number | null>(null);

  const paginate = (newDir: number) => {
    setSlide(([cur]) => {
      const next = (cur + newDir + images.length) % images.length;
      return [next, newDir];
    });
  };

  const jumpTo = (idx: number) => {
    setSlide(([cur]) => [idx, idx > cur ? 1 : -1]);
  };

  const onDragStart = (e: React.TouchEvent) => {
    dragStart.current = e.touches[0].clientX;
  };
  const onDragEnd = (e: React.TouchEvent) => {
    if (dragStart.current === null) return;
    const delta = dragStart.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) paginate(delta > 0 ? 1 : -1);
    dragStart.current = null;
  };

  if (!images.length) return null;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail strip */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[700px] md:w-20 flex-shrink-0 pb-1 md:pb-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => jumpTo(idx)}
            className={`relative aspect-[3/4] w-16 md:w-full flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all duration-500 ${
              activeImage === idx
                ? "border-foreground"
                : "border-transparent opacity-50 hover:opacity-80"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main carousel */}
      <div
        className="flex-1 aspect-[3/4] md:aspect-auto md:h-[700px] bg-neutral-100 dark:bg-neutral-900 rounded-sm overflow-hidden relative select-none"
        onTouchStart={onDragStart}
        onTouchEnd={onDragEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeImage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[activeImage]}
              alt={title}
              className="w-full h-full object-cover object-center"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Arrows — only if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => paginate(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-background/80 backdrop-blur-sm rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-background transition-colors shadow-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => paginate(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-background/80 backdrop-blur-sm rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-background transition-colors shadow-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => jumpTo(idx)}
                  className={`rounded-full transition-all duration-500 ${
                    activeImage === idx
                      ? "w-4 h-1.5 bg-foreground"
                      : "w-1.5 h-1.5 bg-foreground/30 hover:bg-foreground/60"
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function ProductDetailsClient({ product }: { product: Product }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const { data: wishlistData } = useQuery({
    queryKey: QUERY_KEYS.wishlist(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) return { items: [] };
      return fetchWishlist(token);
    },
    enabled: !!session,
  });

  const isInWishlist = wishlistData?.items.some((item) => item.productId === product._id) ?? false;

  const wishlistMutation = useMutation({
    mutationFn: async (action: "add" | "remove") => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return action === "add"
        ? addToWishlist(product._id, token)
        : removeFromWishlist(product._id, token);
    },
    onSuccess: (_, action) => {
      toast.success(action === "add" ? "Added to wishlist" : "Removed from wishlist");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist() });
    },
    onError: () => toast.error("Failed to update wishlist"),
  });

  const handleWishlist = () => {
    if (!session) {
      toast.error("Please login to manage your wishlist");
      return;
    }
    wishlistMutation.mutate(isInWishlist ? "remove" : "add");
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
        <ImageCarousel images={product.images} title={product.title} />

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl md:text-4xl font-serif">{product.title}</h1>
            <button
              onClick={handleWishlist}
              disabled={wishlistMutation.isPending}
              className={`p-2 border rounded-full transition-colors flex-shrink-0 ${
                isInWishlist
                  ? "border-foreground bg-foreground text-background hover:bg-background hover:text-foreground"
                  : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900"
              }`}
              title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              {wishlistMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
              )}
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-xl font-medium">${product.price}</span>
            <div className="flex items-center gap-1 text-neutral-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed whitespace-pre-wrap">
            {product.fullDescription}
          </p>

          {/* Colors */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-3">
              <span className="uppercase tracking-widest font-medium">Color</span>
              <span className="text-neutral-500">{selectedColor || "Select color"}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border text-sm rounded-sm transition-colors ${
                    selectedColor === color
                      ? "border-foreground bg-foreground text-background"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                  }`}
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
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 border text-sm rounded-sm transition-colors ${
                    selectedSize === size
                      ? "border-foreground bg-foreground text-background"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                  }`}
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

      {/* Reviews */}
      <div className="mb-24 pt-16 border-t border-neutral-200 dark:border-neutral-800">
        <ProductReviews productId={product._id} />
      </div>
    </div>
  );
}
