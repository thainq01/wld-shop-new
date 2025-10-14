import { HeroSection } from "./HeroSection";
import { ProductList } from "./ProductList";
import { BottomNavigation } from "./BottomNavigation";
import { DraggableSupport } from "./DraggableSupport";
import { useEffect } from "react";
import { useExploreCache } from "../hooks/useExploreCache";
import { useScrollCache } from "../hooks/useScrollCache";
import { useNavigationCache } from "../hooks/useNavigationCache";
import { CacheDebugPanel } from "./debug/CacheDebugPanel";

export function ExploreScreen() {
  // Initialize enhanced caching system
  const { isInitialized, getCacheStats } = useExploreCache();

  // Initialize scroll position caching
  const scrollCache = useScrollCache("/explore", {
    saveScrollPosition: true,
    restoreScrollPosition: true,
    scrollToTopOnFirstVisit: true,
    debounceMs: 150,
  });

  // Initialize navigation caching
  const navigationCache = useNavigationCache("/explore", {
    enableCache: true,
    cacheTimeout: 15 * 60 * 1000, // 15 minutes cache
    preserveComponentState: false,
  });

  // Log cache statistics in development
  useEffect(() => {
    if (import.meta.env.DEV && isInitialized) {
      const exploreStats = getCacheStats();
      const scrollStats = scrollCache.getScrollCacheStats();
      const navStats = navigationCache.getCacheStats();

      console.log("📊 Explore Screen Cache Stats:", {
        explore: exploreStats,
        scroll: scrollStats,
        navigation: navStats,
      });
    }
  }, [isInitialized, getCacheStats, scrollCache, navigationCache]);

  // Enhanced caching system provides:
  // - Smart preloading and cache warming
  // - Language-aware cache invalidation
  // - Background refresh for stale data
  // - Cache hit/miss tracking
  // - Optimized data fetching with 5-minute TTL
  // - Scroll position persistence across navigation
  // - Navigation state caching for smooth back/forward
  // - Smart scroll restoration (only when returning to page)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="pb-20">
        <HeroSection />
        <ProductList />
      </div>
      <BottomNavigation />
      <DraggableSupport />
      <CacheDebugPanel />
    </div>
  );
}
