import { useProductStore } from "../../store/productStore";
import { useCollectionStore } from "../../store/collectionStore";
import { useEffect } from "react";

export const useCollectionProducts = (collectionName: string = "Core Collection") => {
  const { 
    coreCollectionProducts, 
    limitedDropProducts,
    isLoadingCoreCollection, 
    isLoadingLimitedDrop,
    coreCollectionError, 
    limitedDropError,
    fetchCoreCollectionProducts, 
    fetchLimitedDropProducts 
  } = useProductStore();

  useEffect(() => {
    if (collectionName === "Core Collection" && coreCollectionProducts.length === 0) {
      fetchCoreCollectionProducts();
    } else if (collectionName === "Limited Drop" && limitedDropProducts.length === 0) {
      fetchLimitedDropProducts();
    }
  }, [collectionName, coreCollectionProducts.length, limitedDropProducts.length, fetchCoreCollectionProducts, fetchLimitedDropProducts]);

  const getCollectionData = () => {
    switch (collectionName) {
      case "Limited Drop":
        return {
          products: limitedDropProducts,
          isLoading: isLoadingLimitedDrop,
          error: limitedDropError,
        };
      case "Core Collection":
      default:
        return {
          products: coreCollectionProducts,
          isLoading: isLoadingCoreCollection,
          error: coreCollectionError,
        };
    }
  };

  const { products, isLoading, error } = getCollectionData();

  return {
    products,
    isLoading,
    isError: error,
    refetch: collectionName === "Core Collection" ? fetchCoreCollectionProducts : fetchLimitedDropProducts,
  };
};

export const useCollection = (collectionName: string = "Core Collection") => {
  const { collections, fetchCollections, setCurrentCollection, currentCollection } = useCollectionStore();

  useEffect(() => {
    if (collections.length === 0) {
      fetchCollections();
    }
    setCurrentCollection(collectionName.toLowerCase().replace(" ", "-"));
  }, [collectionName, collections.length, fetchCollections, setCurrentCollection]);

  return {
    collection: currentCollection || {
      id: collectionName.toLowerCase().replace(" ", "-"),
      name: collectionName,
      description: collectionName === "Core Collection" 
        ? "Essential pieces for everyday wear"
        : "Exclusive limited edition items",
    },
    isLoading: false,
    isError: null,
  };
};