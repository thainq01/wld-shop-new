import { create } from "zustand";
import { productsApi, collectionsApi, type Product } from "../utils/api";

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
  clearError: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
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
      const product = await productsApi.getById(productId);
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
      const products = await collectionsApi.getProducts("core-collection");
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
      const products = await collectionsApi.getProducts("limited-drop");
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
      // For slider, fetch featured products or mix from both collections
      const products = await productsApi.getAll({ limit: 6 });
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

  clearError: () => set({ error: null }),
}));
