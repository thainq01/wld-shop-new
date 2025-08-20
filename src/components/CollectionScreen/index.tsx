import React, { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useCollectionProducts, useCollection } from "./data";
import { ProductItem } from "../ProductItem";
import { Product } from "../../types";

// Loading component
const LoadingState = () => (
  <div className="px-4 py-6">
    <div className="animate-pulse space-y-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-1">
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
  </div>
);

// Error component
const ErrorState = ({ onRetry }: { onRetry?: () => void }) => (
  <div className="px-4 py-8 text-center">
    <p className="text-red-500 dark:text-red-400 mb-4">
      Failed to load collection
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

export const CollectionScreen: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  
  // The collectionId parameter is actually a collection slug
  const collectionSlug = collectionId ? decodeURIComponent(collectionId) : "";
  
  const { collection, isLoading: isLoadingCollection, isError: collectionError } = useCollection(collectionSlug);
  const { products, isLoading: isLoadingProducts, isError: productsError, refetch } = useCollectionProducts(collectionSlug);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  const isLoading = isLoadingCollection || isLoadingProducts;
  const isError = collectionError || productsError;

  if (isError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 backdrop-blur-md bg-white/95 dark:bg-gray-900/95">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {collection?.name || "Collection"}
            </h1>
            <div className="w-10"></div> {/* Spacer for center alignment */}
          </div>
        </div>

        <div className="pt-20">
          <ErrorState onRetry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 backdrop-blur-md bg-white/95 dark:bg-gray-900/95">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {collection?.name || "Collection"}
          </h1>
          <div className="w-10"></div> {/* Spacer for center alignment */}
        </div>
      </div>

      <div className="h-20"></div>

      {/* Product List with top padding to account for fixed header */}
      {isLoading ? (
        <div>
          <LoadingState />
        </div>
      ) : (
        <div className="px-4 py-6 pb-20">
          <div className="space-y-4">
            {products.length > 0 ? (
              products.map((product: Product) => (
                <ProductItem key={product.id} product={product} />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p className="text-lg mb-2">No products found</p>
                <p className="text-sm">This collection doesn't have any products yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
