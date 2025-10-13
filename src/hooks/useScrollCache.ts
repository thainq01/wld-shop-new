import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";

interface ScrollPosition {
  x: number;
  y: number;
  timestamp: number;
}

interface ScrollCache {
  [path: string]: ScrollPosition;
}

// Global scroll cache that persists across component unmounts
const scrollCache: ScrollCache = {};

// Track navigation history to determine scroll behavior
const navigationHistory: string[] = [];
const MAX_HISTORY_LENGTH = 10;

export function useScrollCache(
  routePath: string,
  options: {
    saveScrollPosition?: boolean;
    restoreScrollPosition?: boolean;
    scrollToTopOnFirstVisit?: boolean;
    debounceMs?: number;
  } = {}
) {
  const {
    saveScrollPosition = true,
    restoreScrollPosition: shouldRestoreScrollPosition = true,
    scrollToTopOnFirstVisit = true,
    debounceMs = 100,
  } = options;

  const location = useLocation();
  const scrollTimeoutRef = useRef<number>();
  const isFirstVisitRef = useRef(true);
  const lastScrollPositionRef = useRef<ScrollPosition | null>(null);

  // Update navigation history
  useEffect(() => {
    const currentPath = location.pathname;

    // Add current path to history if it's different from the last one
    if (navigationHistory[navigationHistory.length - 1] !== currentPath) {
      navigationHistory.push(currentPath);

      // Keep history size manageable
      if (navigationHistory.length > MAX_HISTORY_LENGTH) {
        navigationHistory.shift();
      }
    }
  }, [location.pathname]);

  // Determine if we should scroll to top based on navigation context
  const shouldScrollToTop = useCallback(() => {
    try {
      // First visit to the app - always scroll to top
      if (isFirstVisitRef.current && scrollToTopOnFirstVisit) {
        return true;
      }

      // If we have cached scroll position, don't scroll to top
      const cachedPosition = scrollCache[routePath];
      if (cachedPosition && shouldRestoreScrollPosition) {
        // Check if cached position is not too old (5 minutes)
        const isStale = Date.now() - cachedPosition.timestamp > 5 * 60 * 1000;
        if (!isStale) {
          return false;
        }
      }

      // Default behavior - scroll to top if no cached position or stale
      return true;
    } catch (error) {
      console.error("Error in shouldScrollToTop:", error);
      return true; // Safe fallback
    }
  }, [routePath, scrollToTopOnFirstVisit, shouldRestoreScrollPosition]);

  // Save current scroll position
  const saveCurrentScrollPosition = useCallback(() => {
    if (!saveScrollPosition) return;

    const scrollPosition: ScrollPosition = {
      x: window.scrollX,
      y: window.scrollY,
      timestamp: Date.now(),
    };

    scrollCache[routePath] = scrollPosition;
    lastScrollPositionRef.current = scrollPosition;

    // Debug logging in development
    if (import.meta.env.DEV) {
      console.log(`💾 Saved scroll position for ${routePath}:`, scrollPosition);
    }
  }, [routePath, saveScrollPosition]);

  // Restore scroll position
  const restoreScrollPosition = useCallback(() => {
    try {
      if (!shouldRestoreScrollPosition) return false;

      const cachedPosition = scrollCache[routePath];

      if (cachedPosition) {
        // Check if cached position is not too old (5 minutes)
        const isStale = Date.now() - cachedPosition.timestamp > 5 * 60 * 1000;

        if (!isStale) {
          // Use requestAnimationFrame to ensure DOM is ready
          requestAnimationFrame(() => {
            window.scrollTo({
              left: cachedPosition.x,
              top: cachedPosition.y,
              behavior: "instant",
            });

            // Debug logging in development
            if (import.meta.env.DEV) {
              console.log(
                `🔄 Restored scroll position for ${routePath}:`,
                cachedPosition
              );
            }
          });
          return true;
        } else {
          // Remove stale cache entry
          delete scrollCache[routePath];
          if (import.meta.env.DEV) {
            console.log(`🗑️ Removed stale scroll cache for ${routePath}`);
          }
        }
      }

      return false;
    } catch (error) {
      console.error("Error in restoreScrollPosition:", error);
      return false;
    }
  }, [routePath, shouldRestoreScrollPosition]);

  // Handle scroll position on mount
  useEffect(() => {
    const shouldScroll = shouldScrollToTop();
    const hasCachedPosition = !!scrollCache[routePath];

    if (import.meta.env.DEV) {
      console.log(`🔄 Scroll Cache Debug for ${routePath}:`, {
        shouldScroll,
        hasCachedPosition,
        isFirstVisit: isFirstVisitRef.current,
        cachedPosition: scrollCache[routePath],
        allCachedPaths: Object.keys(scrollCache),
      });
    }

    if (shouldScroll) {
      // Scroll to top immediately
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });

      if (import.meta.env.DEV) {
        console.log(
          `⬆️ Scrolled to top for ${routePath} (first visit or no cache)`
        );
      }
    } else {
      // Try to restore previous scroll position
      const restored = restoreScrollPosition();

      if (!restored && import.meta.env.DEV) {
        console.log(`📍 No cached scroll position found for ${routePath}`);
      }
    }

    isFirstVisitRef.current = false;
  }, [routePath, shouldScrollToTop, restoreScrollPosition]);

  // Save scroll position on scroll with debouncing
  useEffect(() => {
    if (!saveScrollPosition) return;

    const handleScroll = () => {
      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Debounce scroll saving
      scrollTimeoutRef.current = setTimeout(() => {
        saveCurrentScrollPosition();
      }, debounceMs);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [saveCurrentScrollPosition, debounceMs, saveScrollPosition]);

  // Save scroll position before unmounting
  useEffect(() => {
    return () => {
      if (saveScrollPosition) {
        saveCurrentScrollPosition();
      }
    };
  }, [saveCurrentScrollPosition, saveScrollPosition]);

  // Utility functions
  const clearScrollCache = useCallback((path?: string) => {
    if (path) {
      delete scrollCache[path];
    } else {
      Object.keys(scrollCache).forEach((key) => delete scrollCache[key]);
    }
  }, []);

  const getScrollCacheStats = useCallback(() => {
    return {
      cachedPaths: Object.keys(scrollCache),
      totalCachedPositions: Object.keys(scrollCache).length,
      currentPath: routePath,
      lastPosition: lastScrollPositionRef.current,
      navigationHistory: [...navigationHistory],
    };
  }, [routePath]);

  return {
    saveCurrentScrollPosition,
    restoreScrollPosition,
    clearScrollCache,
    getScrollCacheStats,
    hasScrollCache: !!scrollCache[routePath],
  };
}
