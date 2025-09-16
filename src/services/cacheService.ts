/**
 * Advanced caching service for the explore screen
 * Provides intelligent cache management, preloading, and optimization
 */

import { useCollectionStore } from "../store/collectionStore";
import { useLanguageStore } from "../store/languageStore";

export interface CacheMetrics {
  hitRate: number;
  totalRequests: number;
  cacheSize: number;
  staleCaches: string[];
  oldestCacheAge: number;
}

export interface CacheConfig {
  maxAge: number;
  staleThreshold: number;
  maxSize: number;
  preloadDelay: number;
}

export class CacheService {
  private static instance: CacheService;
  private preloadQueue: Set<string> = new Set();
  private isPreloading = false;

  private constructor() {}

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Get comprehensive cache metrics
   */
  getCacheMetrics(): CacheMetrics {
    const store = useCollectionStore.getState();
    const cacheStatus = store.getCacheStatus();
    const totalRequests = store.cacheHits + store.cacheMisses;
    const hitRate = totalRequests > 0 ? (store.cacheHits / totalRequests) * 100 : 0;

    const now = Date.now();
    const staleThreshold = 4 * 60 * 1000; // 4 minutes
    const staleCaches = Object.entries(cacheStatus)
      .filter(([_, status]) => now - status.lastFetched > staleThreshold)
      .map(([slug]) => slug);

    const oldestCacheAge = Math.max(
      ...Object.values(cacheStatus).map(status => now - status.lastFetched),
      0
    );

    return {
      hitRate,
      totalRequests,
      cacheSize: store.totalCachedProducts,
      staleCaches,
      oldestCacheAge,
    };
  }

  /**
   * Intelligent cache warming based on user behavior patterns
   */
  async warmCacheIntelligently(): Promise<void> {
    if (this.isPreloading) return;
    this.isPreloading = true;

    try {
      const store = useCollectionStore.getState();
      
      // Priority 1: Featured products (always needed)
      await store.fetchFeaturedProducts();

      // Priority 2: Collections metadata
      await store.fetchCollections();

      // Priority 3: Active collection products (in background)
      const collections = store.collections.filter(c => c.isActive);
      
      // Preload collections in order of priority
      const prioritizedCollections = this.prioritizeCollections(collections);
      
      for (const collection of prioritizedCollections) {
        if (this.preloadQueue.has(collection.slug)) continue;
        
        this.preloadQueue.add(collection.slug);
        
        // Add small delay to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
        await store.fetchCollectionProducts(collection.slug);
        
        this.preloadQueue.delete(collection.slug);
      }

      console.log('🔥 Intelligent cache warming completed');
    } catch (error) {
      console.warn('⚠️ Cache warming failed:', error);
    } finally {
      this.isPreloading = false;
    }
  }

  /**
   * Prioritize collections based on various factors
   */
  private prioritizeCollections(collections: any[]): any[] {
    return collections.sort((a, b) => {
      // Priority factors (higher score = higher priority):
      let scoreA = 0;
      let scoreB = 0;

      // Factor 1: Collection name suggests popularity
      const popularKeywords = ['featured', 'popular', 'trending', 'new', 'best'];
      const aHasPopularKeyword = popularKeywords.some(keyword => 
        a.name.toLowerCase().includes(keyword)
      );
      const bHasPopularKeyword = popularKeywords.some(keyword => 
        b.name.toLowerCase().includes(keyword)
      );
      
      if (aHasPopularKeyword) scoreA += 10;
      if (bHasPopularKeyword) scoreB += 10;

      // Factor 2: Shorter slug suggests main collections
      scoreA += Math.max(0, 10 - a.slug.length);
      scoreB += Math.max(0, 10 - b.slug.length);

      // Factor 3: Alphabetical order as tiebreaker
      if (scoreA === scoreB) {
        return a.name.localeCompare(b.name);
      }

      return scoreB - scoreA;
    });
  }

  /**
   * Clean up stale cache entries
   */
  async cleanupStaleCache(): Promise<void> {
    const metrics = this.getCacheMetrics();
    
    if (metrics.staleCaches.length > 0) {
      console.log(`🧹 Cleaning up ${metrics.staleCaches.length} stale cache entries`);
      
      const store = useCollectionStore.getState();
      
      // Refresh stale caches in background
      const refreshPromises = metrics.staleCaches.map(slug => 
        store.fetchCollectionProducts(slug, true)
      );
      
      await Promise.allSettled(refreshPromises);
    }
  }

  /**
   * Preload data based on user navigation patterns
   */
  async preloadForNavigation(targetRoute: string): Promise<void> {
    const store = useCollectionStore.getState();

    switch (targetRoute) {
      case '/explore':
        // Preload explore screen data
        await this.warmCacheIntelligently();
        break;
        
      case '/collection':
        // Preload all collection data
        await store.fetchCollections();
        const collections = store.collections.filter(c => c.isActive);
        await Promise.allSettled(
          collections.map(c => store.fetchCollectionProducts(c.slug))
        );
        break;
        
      default:
        // General preloading
        await store.fetchFeaturedProducts();
        break;
    }
  }

  /**
   * Optimize cache based on current performance
   */
  async optimizeCache(): Promise<void> {
    const metrics = this.getCacheMetrics();
    
    // If hit rate is low, warm the cache more aggressively
    if (metrics.hitRate < 70) {
      console.log('📈 Low hit rate detected, warming cache...');
      await this.warmCacheIntelligently();
    }
    
    // If we have stale caches, clean them up
    if (metrics.staleCaches.length > 0) {
      await this.cleanupStaleCache();
    }
    
    // If cache is getting large, we might want to implement LRU eviction
    if (metrics.cacheSize > 500) {
      console.log('💾 Large cache detected, consider implementing LRU eviction');
    }
  }

  /**
   * Handle language change by invalidating relevant caches
   */
  async handleLanguageChange(newLanguage: string): Promise<void> {
    console.log(`🌐 Language changed to ${newLanguage}, refreshing cache...`);
    
    const store = useCollectionStore.getState();
    await store.refreshAllData();
    
    // Warm cache for new language
    setTimeout(() => {
      this.warmCacheIntelligently();
    }, 500);
  }

  /**
   * Get cache recommendations for optimization
   */
  getCacheRecommendations(): string[] {
    const metrics = this.getCacheMetrics();
    const recommendations: string[] = [];

    if (metrics.hitRate < 50) {
      recommendations.push('Consider implementing more aggressive preloading');
    }

    if (metrics.staleCaches.length > 3) {
      recommendations.push('Multiple stale caches detected, increase refresh frequency');
    }

    if (metrics.oldestCacheAge > 10 * 60 * 1000) {
      recommendations.push('Very old cache detected, consider reducing TTL');
    }

    if (metrics.totalRequests < 10) {
      recommendations.push('Low request count, cache warming may be beneficial');
    }

    if (recommendations.length === 0) {
      recommendations.push('Cache performance is optimal');
    }

    return recommendations;
  }

  /**
   * Export cache statistics for analytics
   */
  exportCacheStats(): Record<string, any> {
    const metrics = this.getCacheMetrics();
    const store = useCollectionStore.getState();
    const cacheStatus = store.getCacheStatus();

    return {
      timestamp: new Date().toISOString(),
      metrics,
      cacheStatus,
      recommendations: this.getCacheRecommendations(),
      language: useLanguageStore.getState().currentLanguage,
    };
  }
}

// Export singleton instance
export const cacheService = CacheService.getInstance();
