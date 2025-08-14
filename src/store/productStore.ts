import { create } from "zustand";
import { Product } from "../types";

interface ProductState {
  // Product data
  sliderProducts: Product[];
  coreCollectionProducts: Product[];
  limitedDropProducts: Product[];

  // Loading states
  isLoadingSlider: boolean;
  isLoadingCoreCollection: boolean;
  isLoadingLimitedDrop: boolean;

  // Error states
  sliderError: string | null;
  coreCollectionError: string | null;
  limitedDropError: string | null;

  // Actions
  fetchSliderProducts: () => Promise<void>;
  fetchCoreCollectionProducts: () => Promise<void>;
  fetchLimitedDropProducts: () => Promise<void>;
  clearErrors: () => void;
}

// Mock API functions - replace with real API calls
const fetchFromAPI = async (endpoint: string): Promise<Product[]> => {
  // For now, simulate API calls with mock data
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  switch (endpoint) {
    case "/api/products/slider":
      return [
        {
          id: "slider-1",
          name: "Featured Hoodie",
          price: 75.0,
          image: "hoodie",
          availability: "Available",
          category: "Featured",
        },
        {
          id: "slider-2",
          name: "Premium T-Shirt",
          price: 45.0,
          image: "tshirt",
          availability: "Available",
          category: "Featured",
        },
        {
          id: "slider-3",
          name: "Exclusive Hat",
          price: 35.0,
          image: "hat",
          availability: "Available",
          category: "Featured",
        },
      ];

    case "/api/products/core-collection":
      return [
        {
          id: "core-1",
          name: "Unique Human Oversized Hoodie",
          price: 60.0,
          image: "hoodie",
          availability: "Available",
          category: "Core Collection",
        },
        {
          id: "core-2",
          name: "Unique Human T-Shirt",
          price: 30.0,
          image: "tshirt",
          availability: "Available",
          category: "Core Collection",
        },
        {
          id: "core-3",
          name: "Unique Human Hat",
          price: 25.0,
          image: "hat",
          availability: "Available",
          category: "Core Collection",
        },
        {
          id: "core-4",
          name: "Unique Human Crewneck",
          price: 50.0,
          image: "crewneck",
          availability: "Available",
          category: "Core Collection",
        },
        {
          id: "core-5",
          name: "Not A Bot Hat",
          price: 29.99,
          image: "bot-hat",
          availability: "Available",
          category: "Core Collection",
        },
      ];

    case "/api/products/limited-drop":
      return [
        {
          id: "limited-1",
          name: "Limited Edition Hoodie",
          price: 85.0,
          image: "hoodie",
          availability: "Available",
          category: "Limited Drop",
        },
        {
          id: "limited-2",
          name: "Exclusive Crewneck",
          price: 65.0,
          image: "crewneck",
          availability: "Available",
          category: "Limited Drop",
        },
        {
          id: "limited-3",
          name: "Rare Design Tee",
          price: 40.0,
          image: "tshirt",
          availability: "Available",
          category: "Limited Drop",
        },
        {
          id: "limited-4",
          name: "Collector's Cap",
          price: 45.0,
          image: "hat",
          availability: "Available",
          category: "Limited Drop",
        },
        {
          id: "limited-5",
          name: "Premium Bot Hat",
          price: 55.0,
          image: "bot-hat",
          availability: "Available",
          category: "Limited Drop",
        },
        {
          id: "limited-6",
          name: "Signature Hoodie",
          price: 90.0,
          image: "hoodie",
          availability: "Available",
          category: "Limited Drop",
        },
        {
          id: "limited-7",
          name: "Artist Collaboration Tee",
          price: 50.0,
          image: "tshirt",
          availability: "Available",
          category: "Limited Drop",
        },
        {
          id: "limited-8",
          name: "Limited Crewneck V2",
          price: 70.0,
          image: "crewneck",
          availability: "Available",
          category: "Limited Drop",
        },
      ];

    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
};

export const useProductStore = create<ProductState>((set) => ({
  // Initial state
  sliderProducts: [],
  coreCollectionProducts: [],
  limitedDropProducts: [],

  isLoadingSlider: false,
  isLoadingCoreCollection: false,
  isLoadingLimitedDrop: false,

  sliderError: null,
  coreCollectionError: null,
  limitedDropError: null,

  // Actions
  fetchSliderProducts: async () => {
    set({ isLoadingSlider: true, sliderError: null });
    try {
      const products = await fetchFromAPI("/api/products/slider");
      set({ sliderProducts: products, isLoadingSlider: false });
    } catch (error) {
      set({
        sliderError:
          error instanceof Error
            ? error.message
            : "Failed to fetch slider products",
        isLoadingSlider: false,
      });
    }
  },

  fetchCoreCollectionProducts: async () => {
    set({ isLoadingCoreCollection: true, coreCollectionError: null });
    try {
      const products = await fetchFromAPI("/api/products/core-collection");
      set({ coreCollectionProducts: products, isLoadingCoreCollection: false });
    } catch (error) {
      set({
        coreCollectionError:
          error instanceof Error
            ? error.message
            : "Failed to fetch core collection products",
        isLoadingCoreCollection: false,
      });
    }
  },

  fetchLimitedDropProducts: async () => {
    set({ isLoadingLimitedDrop: true, limitedDropError: null });
    try {
      const products = await fetchFromAPI("/api/products/limited-drop");
      set({ limitedDropProducts: products, isLoadingLimitedDrop: false });
    } catch (error) {
      set({
        limitedDropError:
          error instanceof Error
            ? error.message
            : "Failed to fetch limited drop products",
        isLoadingLimitedDrop: false,
      });
    }
  },

  clearErrors: () => {
    set({
      sliderError: null,
      coreCollectionError: null,
      limitedDropError: null,
    });
  },
}));
