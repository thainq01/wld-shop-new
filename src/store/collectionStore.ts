import { create } from "zustand";
import { subscribeWithSelector, persist } from "zustand/middleware";
import { collectionsApi, productsApi } from "../utils/api";
import { Product, Collection } from "../types";
import { useLanguageStore, type Language } from "./languageStore";

// Cache configuration constants
const CACHE_CONFIG = {
  COLLECTION_PRODUCTS_TTL: 5 * 60 * 1000, // 5 minutes
  FEATURED_PRODUCTS_TTL: 5 * 60 * 1000, // 5 minutes
  COLLECTIONS_TTL: 10 * 60 * 1000, // 10 minutes
  STALE_THRESHOLD: 4 * 60 * 1000, // 4 minutes (warn before expiry)
  MAX_CACHE_SIZE: 1000, // Maximum products to cache
} as const;

interface CollectionState {
  collections: Collection[];
  currentCollection: Collection | null;
  isLoading: boolean;
  error: string | null;

  // Collection products caching
  collectionProducts: Record<string, Product[]>;
  loadingStates: Record<string, boolean>;
  lastFetched: Record<string, number>;

  // Featured products caching
  featuredProducts: Product[];
  featuredProductsLoading: boolean;
  featuredProductsLastFetched: number;

  // Enhanced cache metadata
  collectionsLastFetched: number;
  cacheHits: number;
  cacheMisses: number;
  totalCachedProducts: number;

  // Actions
  fetchCollections: () => Promise<void>;
  fetchCollectionProducts: (
    collectionSlug: string,
    forceRefresh?: boolean
  ) => Promise<void>;
  fetchFeaturedProducts: (forceRefresh?: boolean) => Promise<void>;
  refreshAllData: () => Promise<void>; // Refresh all collections and their products
  setCurrentCollection: (collectionSlug: string) => void;
  clearError: () => void;
  clearCache: () => void;
  getCollectionProducts: (collectionSlug: string) => Product[];
  getFeaturedProducts: () => Product[];
  isCollectionProductsLoaded: (collectionSlug: string) => boolean;
  isCollectionProductsLoading: (collectionSlug: string) => boolean;
  isFeaturedProductsLoading: () => boolean;
  getCacheStatus: () => {
    [key: string]: { lastFetched: number; productCount: number };
  }; // Debug method
}

export const useCollectionStore = create<CollectionState>()(
  subscribeWithSelector((set, get) => ({
    collections: [],
    currentCollection: null,
    isLoading: false,
    error: null,
    collectionProducts: {},
    loadingStates: {},
    lastFetched: {},
    featuredProducts: [],
    featuredProductsLoading: false,
    featuredProductsLastFetched: 0,

    // Enhanced cache metadata
    collectionsLastFetched: 0,
    cacheHits: 0,
    cacheMisses: 0,
    totalCachedProducts: 0,

    fetchCollections: async () => {
      const { collections, collectionsLastFetched, cacheHits } = get();

      // Check cache age
      const now = Date.now();
      if (
        collections.length > 0 &&
        collectionsLastFetched &&
        now - collectionsLastFetched < CACHE_CONFIG.COLLECTIONS_TTL
      ) {
        set({ cacheHits: cacheHits + 1 });
        return;
      }

      set({ isLoading: true, error: null });
      try {
        // Get product language (maps EN to TH since we don't have English products)
        const productLanguage = useLanguageStore
          .getState()
          .getProductLanguage();
        const collections = await collectionsApi.getAll({
          lang: productLanguage,
        });
        set({
          collections,
          isLoading: false,
          collectionsLastFetched: now,
          cacheMisses: get().cacheMisses + 1,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch collections",
          isLoading: false,
        });
      }
    },

    fetchCollectionProducts: async (
      collectionSlug: string,
      forceRefresh = false,
      sort?: string
    ) => {
      const { collectionProducts, loadingStates, lastFetched, cacheHits } =
        get();

      // Check if already loaded and not forcing refresh
      if (
        !forceRefresh &&
        collectionProducts[collectionSlug] &&
        !loadingStates[collectionSlug]
      ) {
        set({ cacheHits: cacheHits + 1 });
        return;
      }

      // Check cache age using configuration constant
      const lastFetchTime = lastFetched[collectionSlug];
      if (
        !forceRefresh &&
        lastFetchTime &&
        Date.now() - lastFetchTime < CACHE_CONFIG.COLLECTION_PRODUCTS_TTL
      ) {
        set({ cacheHits: cacheHits + 1 });
        return;
      }

      set({
        loadingStates: { ...loadingStates, [collectionSlug]: true },
        error: null,
      });

      try {
        // Get product language (maps EN to TH since we don't have English products)
        const productLanguage = useLanguageStore
          .getState()
          .getProductLanguage();
        const products = await collectionsApi.getProducts(collectionSlug, {
          lang: productLanguage,
          country: productLanguage, // Use same value for country as lang
          active: true,
          sort,
        });
        set((state) => {
          const newTotalProducts = Object.values({
            ...state.collectionProducts,
            [collectionSlug]: products,
          }).reduce((sum, prods) => sum + prods.length, 0);

          return {
            collectionProducts: {
              ...state.collectionProducts,
              [collectionSlug]: products,
            },
            loadingStates: {
              ...state.loadingStates,
              [collectionSlug]: false,
            },
            lastFetched: {
              ...state.lastFetched,
              [collectionSlug]: Date.now(),
            },
            cacheMisses: state.cacheMisses + 1,
            totalCachedProducts: newTotalProducts,
          };
        });
      } catch (error) {
        console.error(`Failed to fetch products for ${collectionSlug}:`, error);
        set((state) => ({
          collectionProducts: {
            ...state.collectionProducts,
            [collectionSlug]: [],
          },
          loadingStates: {
            ...state.loadingStates,
            [collectionSlug]: false,
          },
          error:
            error instanceof Error ? error.message : "Failed to fetch products",
        }));
      }
    },

    fetchFeaturedProducts: async (forceRefresh = false, sort?: string) => {
      const {
        featuredProducts,
        featuredProductsLoading,
        featuredProductsLastFetched,
        cacheHits,
      } = get();

      // Check if already loaded and not forcing refresh
      if (
        !forceRefresh &&
        featuredProducts.length > 0 &&
        !featuredProductsLoading
      ) {
        set({ cacheHits: cacheHits + 1 });
        return;
      }

      // Check cache age using configuration constant
      if (
        !forceRefresh &&
        featuredProductsLastFetched &&
        Date.now() - featuredProductsLastFetched <
          CACHE_CONFIG.FEATURED_PRODUCTS_TTL
      ) {
        set({ cacheHits: cacheHits + 1 });
        return;
      }

      set({ featuredProductsLoading: true, error: null });

      try {
        // For featured products, use UI language for both lang and country
        const currentLanguage = useLanguageStore.getState().currentLanguage;
        const allProducts = await productsApi.getAll({
          lang: currentLanguage,
          country: currentLanguage,
          active: true,
          sort,
        });
        const featured = allProducts.filter((product) => product.featured);

        set((state) => ({
          featuredProducts: featured,
          featuredProductsLoading: false,
          featuredProductsLastFetched: Date.now(),
          cacheMisses: state.cacheMisses + 1,
        }));
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
        set({
          featuredProducts: [],
          featuredProductsLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch featured products",
        });
      }
    },

    refreshAllData: async () => {
      // Clear cache and refetch collections
      set({
        collections: [],
        collectionProducts: {},
        loadingStates: {},
        lastFetched: {},
        featuredProducts: [],
        featuredProductsLastFetched: 0,
      });

      // Fetch collections first
      await get().fetchCollections();

      // Then fetch featured products and products for all active collections
      const updatedCollections = get().collections;
      const promises = [
        get().fetchFeaturedProducts(true),
        ...updatedCollections
          .filter((collection) => collection.isActive)
          .map((collection) =>
            get().fetchCollectionProducts(collection.slug, true)
          ),
      ];

      await Promise.all(promises);
    },

    setCurrentCollection: (collectionSlug: string) => {
      const { collections } = get();
      const collection = collections.find((c) => c.slug === collectionSlug);
      set({ currentCollection: collection || null });
    },

    clearError: () => {
      set({ error: null });
    },

    clearCache: () => {
      set({
        collectionProducts: {},
        loadingStates: {},
        lastFetched: {},
        featuredProducts: [],
        featuredProductsLastFetched: 0,
      });
    },

    getCollectionProducts: (collectionSlug: string) => {
      const { collectionProducts } = get();
      return collectionProducts[collectionSlug] || [];
    },

    getFeaturedProducts: () => {
      const { featuredProducts } = get();
      return featuredProducts;
    },

    isCollectionProductsLoaded: (collectionSlug: string) => {
      const { collectionProducts } = get();
      return !!collectionProducts[collectionSlug];
    },

    isCollectionProductsLoading: (collectionSlug: string) => {
      const { loadingStates } = get();
      return !!loadingStates[collectionSlug];
    },

    isFeaturedProductsLoading: () => {
      const { featuredProductsLoading } = get();
      return featuredProductsLoading;
    },

    getCacheStatus: () => {
      const {
        collectionProducts,
        lastFetched,
        featuredProducts,
        featuredProductsLastFetched,
      } = get();
      const status: {
        [key: string]: { lastFetched: number; productCount: number };
      } = {};

      // Add collection products to status
      Object.keys(collectionProducts).forEach((slug) => {
        status[slug] = {
          lastFetched: lastFetched[slug] || 0,
          productCount: collectionProducts[slug]?.length || 0,
        };
      });

      // Add featured products to status
      status["featured"] = {
        lastFetched: featuredProductsLastFetched,
        productCount: featuredProducts.length,
      };

      return status;
    },
  }))
);

// Subscribe to language changes and refresh data when language changes
let previousLanguage = useLanguageStore.getState().currentLanguage;

useLanguageStore.subscribe((state: { currentLanguage: Language }) => {
  const currentLanguage = state.currentLanguage;
  // Only refresh if language actually changed
  if (currentLanguage !== previousLanguage) {
    console.log(
      `Language changed from ${previousLanguage} to ${currentLanguage}, refreshing data...`
    );
    previousLanguage = currentLanguage;

    // Clear cache and refresh all data
    useCollectionStore.getState().refreshAllData();
  }
});
