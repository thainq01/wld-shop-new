// No longer needed since we're fetching directly from API
import { useCollectionStore } from "../store/collectionStore";
import { ProductItem } from "./ProductItem";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Product } from "../types";

export function ProductList() {
  const navigate = useNavigate();
  const {
    collections,
    isLoading: isLoadingCollections,
    fetchCollections,
    fetchCollectionProducts,
    getCollectionProducts,
    isCollectionProductsLoading,
  } = useCollectionStore();

  useEffect(() => {
    // Fetch collections first
    fetchCollections();
  }, [fetchCollections]);

  useEffect(() => {
    // Fetch products for each active collection
    const loadCollectionProducts = async () => {
      for (const collection of collections) {
        if (collection.isActive) {
          // This will only fetch if not already cached
          await fetchCollectionProducts(collection.slug);
        }
      }
    };

    if (collections.length > 0) {
      loadCollectionProducts();
    }
  }, [collections, fetchCollectionProducts]);

  const handleSeeAllClick = (collectionSlug: string) => {
    console.log("collectionSlug", collectionSlug);
    navigate(`/collection/${encodeURIComponent(collectionSlug)}`);
  };

  // Loading component for sections
  const SectionLoading = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
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
  );

  // Show loading state while fetching collections
  if (isLoadingCollections) {
    return (
      <div className="px-4 pb-20 space-y-8">
        <SectionLoading />
      </div>
    );
  }

  const activeCollections = collections.filter(
    (collection) => collection.isActive
  );

  return (
    <div className="px-4 pb-20 space-y-8">
      {activeCollections.map((collection) => {
        const products = getCollectionProducts(collection.slug);
        const isLoading = isCollectionProductsLoading(collection.slug);

        return (
          <div key={collection.id}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {collection.name}
              </h3>
              <button
                onClick={() => handleSeeAllClick(collection.slug)}
                className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                See all
              </button>
            </div>

            {isLoading ? (
              <SectionLoading />
            ) : (
              <div className="space-y-4">
                {products.slice(0, 5).map((product: Product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
                {products.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No products available in this collection
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {activeCollections.length === 0 && !isLoadingCollections && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">No collections available</p>
          <p className="text-sm">Check back later for new products</p>
        </div>
      )}
    </div>
  );
}
