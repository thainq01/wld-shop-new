import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { productsApi, collectionsApi } from "../utils/api";
import { Product } from "../types";
import { useLanguageStore, type Language } from "./languageStore";

interface ProductState {
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;

  // Collection-specific states
  coreCollectionProducts: Product[];
  limitedDropProducts: Product[];
  sliderProducts: Product[];
  isLoadingCoreCollection: boolean;
  isLoadingLimitedDrop: boolean;
  isLoadingSlider: boolean;

  // Actions
  fetchProductDetail: (productId: string | number) => Promise<void>;
  fetchCoreCollectionProducts: () => Promise<void>;
  fetchLimitedDropProducts: () => Promise<void>;
  fetchSliderProducts: () => Promise<void>;
  refreshAllProductData: () => Promise<void>;
  clearError: () => void;
}

export const useProductStore = create<ProductState>()(
  subscribeWithSelector((set, get) => ({
    currentProduct: null,
    isLoading: false,
    error: null,

    // Collection-specific initial states
    coreCollectionProducts: [],
    limitedDropProducts: [],
    sliderProducts: [],
    isLoadingCoreCollection: false,
    isLoadingLimitedDrop: false,
    isLoadingSlider: false,

    fetchProductDetail: async (productId: string | number) => {
      set({ isLoading: true, error: null });

      try {
        // For product detail, use UI language for both lang and country
        const currentLanguage = useLanguageStore.getState().currentLanguage;
        const product = await productsApi.getById(productId, {
          lang: currentLanguage,
          country: currentLanguage,
        });
        set({ currentProduct: product, isLoading: false });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to fetch product",
          isLoading: false,
          currentProduct: null,
        });
      }
    },

    fetchCoreCollectionProducts: async () => {
      set({ isLoadingCoreCollection: true, error: null });

      try {
        // For collections, use UI language for both lang and country
        const currentLanguage = useLanguageStore.getState().currentLanguage;
        const products = await collectionsApi.getProducts("core-collection", {
          lang: currentLanguage,
          country: currentLanguage,
          active: true,
        });
        set({
          coreCollectionProducts: products,
          isLoadingCoreCollection: false,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch core collection products",
          isLoadingCoreCollection: false,
        });
      }
    },

    fetchLimitedDropProducts: async () => {
      set({ isLoadingLimitedDrop: true, error: null });

      try {
        // For collections, use UI language for both lang and country
        const currentLanguage = useLanguageStore.getState().currentLanguage;
        const products = await collectionsApi.getProducts("limited-drop", {
          lang: currentLanguage,
          country: currentLanguage,
          active: true,
        });
        set({
          limitedDropProducts: products,
          isLoadingLimitedDrop: false,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch limited drop products",
          isLoadingLimitedDrop: false,
        });
      }
    },

    fetchSliderProducts: async () => {
      set({ isLoadingSlider: true, error: null });

      try {
        // For slider products, use UI language for both lang and country
        const currentLanguage = useLanguageStore.getState().currentLanguage;
        // For slider, fetch featured products or mix from both collections
        const products = await productsApi.getAll({
          limit: 6,
          lang: currentLanguage,
          country: currentLanguage,
          active: true,
        });
        set({
          sliderProducts: products,
          isLoadingSlider: false,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch slider products",
          isLoadingSlider: false,
        });
      }
    },

    refreshAllProductData: async () => {
      // Clear current product
      set({ currentProduct: null });

      // Refetch all product collections
      const state = get();
      await Promise.all([
        state.fetchCoreCollectionProducts(),
        state.fetchLimitedDropProducts(),
        state.fetchSliderProducts(),
      ]);
    },

    clearError: () => set({ error: null }),
  }))
);

// Subscribe to language changes and refresh product data when language changes
let previousLanguageForProducts = useLanguageStore.getState().currentLanguage;

useLanguageStore.subscribe((state: { currentLanguage: Language }) => {
  const currentLanguage = state.currentLanguage;
  // Only refresh if language actually changed
  if (currentLanguage !== previousLanguageForProducts) {
    console.log(`Language changed, refreshing product data...`);
    previousLanguageForProducts = currentLanguage;

    // Refresh all product data
    useProductStore.getState().refreshAllProductData();
  }
});
