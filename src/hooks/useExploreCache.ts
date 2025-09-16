import { useEffect, useCallback, useRef } from "react";
import { useCollectionStore } from "../store/collectionStore";
import { useLanguageStore } from "../store/languageStore";
import { cacheService } from "../services/cacheService";

/**
 * Enhanced caching hook for the explore screen
 * Implements smart preloading, cache warming, and optimized data fetching
 */
export function useExploreCache() {
  const {
    collections,
    isLoading: isLoadingCollections,
    getCollectionProducts,
    getFeaturedProducts,
    isCollectionProductsLoading,
    isFeaturedProductsLoading,
    refreshAllData,
  } = useCollectionStore();

  const { currentLanguage } = useLanguageStore();
  const lastLanguageRef = useRef(currentLanguage);
  const isInitializedRef = useRef(false);
  const preloadingRef = useRef(false);

  // Check if cache needs refresh due to language change
  const shouldRefreshCache = useCallback(() => {
    return lastLanguageRef.current !== currentLanguage;
  }, [currentLanguage]);

  // Smart cache warming - preload data in background using cache service
  const warmCache = useCallback(async () => {
    if (preloadingRef.current) return;
    preloadingRef.current = true;

    try {
      await cacheService.warmCacheIntelligently();
      console.log("✅ Intelligent cache warming completed");
    } catch (error) {
      console.warn("⚠️ Cache warming failed:", error);
    } finally {
      preloadingRef.current = false;
    }
  }, []);

  // Initialize cache on first load or language change
  const initializeCache = useCallback(async () => {
    if (shouldRefreshCache()) {
      console.log("🔄 Language changed, refreshing cache...");
      await refreshAllData();
      lastLanguageRef.current = currentLanguage;
    } else if (!isInitializedRef.current) {
      console.log("🚀 Initializing explore cache...");
      await warmCache();
    }
    isInitializedRef.current = true;
  }, [shouldRefreshCache, refreshAllData, currentLanguage, warmCache]);

  // Background refresh for stale data using cache service
  const refreshStaleData = useCallback(async () => {
    await cacheService.cleanupStaleCache();
  }, []);

  // Initialize cache on mount and language changes
  useEffect(() => {
    initializeCache();
  }, [initializeCache]);

  // Set up background refresh interval
  useEffect(() => {
    const interval = setInterval(refreshStaleData, 3 * 60 * 1000); // Check every 3 minutes
    return () => clearInterval(interval);
  }, [refreshStaleData]);

  // Preload data when user is likely to navigate (on focus)
  useEffect(() => {
    const handleFocus = () => {
      if (document.visibilityState === "visible") {
        warmCache();
      }
    };

    document.addEventListener("visibilitychange", handleFocus);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleFocus);
      window.removeEventListener("focus", handleFocus);
    };
  }, [warmCache]);

  // Get cache statistics for debugging using cache service
  const getCacheStats = useCallback(() => {
    return cacheService.getCacheMetrics();
  }, []);

  return {
    // Data
    collections,
    featuredProducts: getFeaturedProducts(),

    // Loading states
    isLoadingCollections,
    isFeaturedProductsLoading: isFeaturedProductsLoading(),
    isInitialized: isInitializedRef.current,

    // Functions
    getCollectionProducts,
    isCollectionProductsLoading,
    warmCache,
    refreshStaleData,
    getCacheStats,

    // Force refresh
    refreshAll: refreshAllData,
  };
}
