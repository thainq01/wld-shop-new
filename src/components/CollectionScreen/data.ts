import { useEffect } from "react";
import { useCollectionStore } from "../../store/collectionStore";

export const useCollectionProducts = (collectionSlug: string) => {
  const {
    fetchCollectionProducts,
    getCollectionProducts,
    isCollectionProductsLoading,
    error,
  } = useCollectionStore();

  useEffect(() => {
    if (collectionSlug) {
      // This will only fetch if not already cached
      fetchCollectionProducts(collectionSlug);
    }
  }, [collectionSlug, fetchCollectionProducts]);

  return {
    products: getCollectionProducts(collectionSlug),
    isLoading: isCollectionProductsLoading(collectionSlug),
    isError: error,
    refetch: () => fetchCollectionProducts(collectionSlug, true), // Force refresh on retry
  };
};

export const useCollection = (collectionSlug: string) => {
  const { 
    collections, 
    fetchCollections, 
    isLoading: isLoadingCollections,
    error,
  } = useCollectionStore();

  useEffect(() => {
    // Fetch collections if not already loaded
    fetchCollections();
  }, [fetchCollections]);

  // Find the collection by slug
  const collection = collections.find((coll) => coll.slug === collectionSlug) || null;

  return {
    collection,
    isLoading: isLoadingCollections,
    isError: !collection && collections.length > 0 ? `Collection with slug "${collectionSlug}" not found` : error,
  };
};
