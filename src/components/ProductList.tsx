import { useProductStore } from "../store/productStore";
import { ProductItem } from "./ProductItem";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ProductList() {
  const navigate = useNavigate();
  const {
    coreCollectionProducts,
    limitedDropProducts,
    isLoadingCoreCollection,
    isLoadingLimitedDrop,
    fetchCoreCollectionProducts,
    fetchLimitedDropProducts,
  } = useProductStore();

  useEffect(() => {
    if (coreCollectionProducts.length === 0) {
      fetchCoreCollectionProducts();
    }
    if (limitedDropProducts.length === 0) {
      fetchLimitedDropProducts();
    }
  }, [
    coreCollectionProducts.length,
    limitedDropProducts.length,
    fetchCoreCollectionProducts,
    fetchLimitedDropProducts,
  ]);

  const handleSeeAllClick = (collectionName: string) => {
    navigate(`/collection/${encodeURIComponent(collectionName)}`);
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

  return (
    <div className="px-4 pb-20 space-y-8">
      {/* Core Collection Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Core Collection
          </h3>
          <button
            onClick={() => handleSeeAllClick("Core Collection")}
            className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            See all
          </button>
        </div>

        {isLoadingCoreCollection ? (
          <SectionLoading />
        ) : (
          <div className="space-y-4">
            {coreCollectionProducts.slice(0, 5).map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Limited Drop Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Limited Drop
          </h3>
          <button
            onClick={() => handleSeeAllClick("Limited Drop")}
            className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            See all
          </button>
        </div>

        {isLoadingLimitedDrop ? (
          <SectionLoading />
        ) : (
          <div className="space-y-4">
            {limitedDropProducts.slice(0, 5).map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
