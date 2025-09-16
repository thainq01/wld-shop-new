import { HeroSection } from "./HeroSection";
import { ProductList } from "./ProductList";
import { BottomNavigation } from "./BottomNavigation";
import { useEffect } from "react";
import { useExploreCache } from "../hooks/useExploreCache";
import { CacheDebugPanel } from "./debug/CacheDebugPanel";

export function ExploreScreen() {
  // Initialize enhanced caching system
  const { isInitialized, getCacheStats } = useExploreCache();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  // Log cache statistics in development
  useEffect(() => {
    if (import.meta.env.DEV && isInitialized) {
      const stats = getCacheStats();
      console.log("📊 Explore Cache Stats:", stats);
    }
  }, [isInitialized, getCacheStats]);

  // Enhanced caching system provides:
  // - Smart preloading and cache warming
  // - Language-aware cache invalidation
  // - Background refresh for stale data
  // - Cache hit/miss tracking
  // - Optimized data fetching with 5-minute TTL

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="pb-20">
        <HeroSection />
        <ProductList />
      </div>
      <BottomNavigation />
      <CacheDebugPanel />
    </div>
  );
}
