import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchProductById, fetchProducts } from "@/lib/api";
import { ProductDetailsClient } from "@/components/product/ProductDetailsClient";
import { ProductCard } from "@/components/cards/ProductCard";
import { RecommendationsSection } from "@/components/product/RecommendationsSection";
import { PageMotion } from "@/components/ui/PageMotion";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);
  
  if (!product) {
    return {
      title: "Product Not Found | HR Fashion",
    };
  }

  return {
    title: `${product.title} | HR Fashion`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;
  const product = await fetchProductById(id);
  
  if (!product) {
    notFound();
  }

  // Fetch related products
  const relatedRes = await fetchProducts(`category=${encodeURIComponent(product.category)}&limit=5`);
  const related = relatedRes.products.filter(p => p._id !== product._id).slice(0, 4);

  return (
    <PageMotion>
      <ProductDetailsClient product={product} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-16">
        <RecommendationsSection />

        {/* Related Products */}
        <div className="border-t border-card-border pt-16">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-serif">Related Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.length > 0 ? (
              related.map(p => (
                <ProductCard key={p._id} {...p} />
              ))
            ) : (
              <p className="text-muted col-span-full">No related products found.</p>
            )}
          </div>
        </div>
      </div>
    </PageMotion>
  );
}
