import { useEffect } from "react";
import { Star } from "lucide-react";
import { ProductItem } from "./ProductItem";
import { useCollectionStore } from "../store/collectionStore";
import { useTranslation } from "react-i18next";

export function FeaturedProducts() {
  const { t } = useTranslation();
  const {
    fetchFeaturedProducts,
    getFeaturedProducts,
    isFeaturedProductsLoading,
  } = useCollectionStore();

  const featuredProducts = getFeaturedProducts();
  const isLoading = isFeaturedProductsLoading();

  useEffect(() => {
    // This will only fetch if not already cached
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  // Don't render if no featured products
  if (!isLoading && featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className="px-4 pb-8">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-yellow-500 fill-current" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {t("featuredProducts")}
        </h3>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-1 animate-pulse">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {featuredProducts.slice(0, 3).map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
