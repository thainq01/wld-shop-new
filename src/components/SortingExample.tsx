import React, { useState } from "react";
import { useCollectionStore } from "../store/collectionStore";
import { useProductStore } from "../store/productStore";

/**
 * Example component showing how to use the sorting feature
 * This is for demonstration purposes - you can integrate this logic into your existing components
 */
export function SortingExample() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { fetchCollectionProducts, fetchFeaturedProducts } = useCollectionStore();
  const { fetchSliderProducts } = useProductStore();

  const handleSortChange = async (newSortOrder: "asc" | "desc") => {
    setSortOrder(newSortOrder);
    
    // Example: Sort collection products
    await fetchCollectionProducts("maldini-leather", true, newSortOrder);
    
    // Example: Sort featured products
    await fetchFeaturedProducts(true, newSortOrder);
    
    // Example: Sort slider products
    await fetchSliderProducts(newSortOrder);
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Product Sorting Example
      </h3>
      
      <div className="flex gap-2">
        <button
          onClick={() => handleSortChange("asc")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            sortOrder === "asc"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Sort Ascending
        </button>
        
        <button
          onClick={() => handleSortChange("desc")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            sortOrder === "desc"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Sort Descending
        </button>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        Current sort order: <strong>{sortOrder}</strong>
      </p>
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
        <p>This will generate API calls like:</p>
        <code className="block mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded">
          /api/collections/maldini-leather/products?lang=en&country=en&active=true&sort={sortOrder}
        </code>
      </div>
    </div>
  );
}
