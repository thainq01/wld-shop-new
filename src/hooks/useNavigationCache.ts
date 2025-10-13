import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationState {
  path: string;
  timestamp: number;
  scrollPosition: { x: number; y: number };
  componentState?: any;
}

interface NavigationCache {
  [path: string]: NavigationState;
}

// Global navigation cache
const navigationCache: NavigationCache = {};

// Track if we're returning to a previously visited page
const visitedPaths = new Set<string>();

export function useNavigationCache(
  routePath: string,
  options: {
    enableCache?: boolean;
    cacheTimeout?: number; // in milliseconds
    preserveComponentState?: boolean;
  } = {}
) {
  const {
    enableCache = true,
    cacheTimeout = 10 * 60 * 1000, // 10 minutes default
    preserveComponentState = false,
  } = options;

  const location = useLocation();
  const isReturningRef = useRef(false);
  const componentStateRef = useRef<any>(null);

  // Check if this is a return visit
  const isReturningToPage = useCallback(() => {
    return visitedPaths.has(routePath);
  }, [routePath]);

  // Mark page as visited
  useEffect(() => {
    visitedPaths.add(routePath);
  }, [routePath]);

  // Check if we have valid cached data
  const hasCachedData = useCallback(() => {
    if (!enableCache) return false;
    
    const cached = navigationCache[routePath];
    if (!cached) return false;
    
    // Check if cache is still valid (not expired)
    const isExpired = Date.now() - cached.timestamp > cacheTimeout;
    if (isExpired) {
      delete navigationCache[routePath];
      return false;
    }
    
    return true;
  }, [routePath, enableCache, cacheTimeout]);

  // Save navigation state
  const saveNavigationState = useCallback((componentState?: any) => {
    if (!enableCache) return;
    
    const state: NavigationState = {
      path: routePath,
      timestamp: Date.now(),
      scrollPosition: {
        x: window.scrollX,
        y: window.scrollY,
      },
      componentState: preserveComponentState ? componentState : undefined,
    };
    
    navigationCache[routePath] = state;
    
    if (import.meta.env.DEV) {
      console.log(`💾 Saved navigation state for ${routePath}:`, state);
    }
  }, [routePath, enableCache, preserveComponentState]);

  // Get cached navigation state
  const getCachedState = useCallback(() => {
    if (!enableCache) return null;
    
    const cached = navigationCache[routePath];
    if (!cached) return null;
    
    // Check if cache is still valid
    const isExpired = Date.now() - cached.timestamp > cacheTimeout;
    if (isExpired) {
      delete navigationCache[routePath];
      return null;
    }
    
    return cached;
  }, [routePath, enableCache, cacheTimeout]);

  // Restore navigation state
  const restoreNavigationState = useCallback(() => {
    const cached = getCachedState();
    if (!cached) return false;
    
    // Restore scroll position
    requestAnimationFrame(() => {
      window.scrollTo({
        left: cached.scrollPosition.x,
        top: cached.scrollPosition.y,
        behavior: 'instant',
      });
    });
    
    // Restore component state if available
    if (cached.componentState && preserveComponentState) {
      componentStateRef.current = cached.componentState;
    }
    
    if (import.meta.env.DEV) {
      console.log(`🔄 Restored navigation state for ${routePath}:`, cached);
    }
    
    return true;
  }, [getCachedState, routePath, preserveComponentState]);

  // Determine navigation behavior on mount
  useEffect(() => {
    const isReturning = isReturningToPage();
    isReturningRef.current = isReturning;
    
    if (isReturning && hasCachedData()) {
      // Restore previous state
      restoreNavigationState();
    } else {
      // Fresh visit - scroll to top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
      
      if (import.meta.env.DEV) {
        console.log(`⬆️ Fresh visit to ${routePath}, scrolled to top`);
      }
    }
  }, [routePath, isReturningToPage, hasCachedData, restoreNavigationState]);

  // Save state before unmounting
  useEffect(() => {
    return () => {
      saveNavigationState(componentStateRef.current);
    };
  }, [saveNavigationState]);

  // Clear cache for specific path or all paths
  const clearNavigationCache = useCallback((path?: string) => {
    if (path) {
      delete navigationCache[path];
      visitedPaths.delete(path);
    } else {
      Object.keys(navigationCache).forEach(key => delete navigationCache[key]);
      visitedPaths.clear();
    }
    
    if (import.meta.env.DEV) {
      console.log(`🗑️ Cleared navigation cache for ${path || 'all paths'}`);
    }
  }, []);

  // Get cache statistics
  const getCacheStats = useCallback(() => {
    return {
      cachedPaths: Object.keys(navigationCache),
      visitedPaths: Array.from(visitedPaths),
      currentPath: routePath,
      isReturning: isReturningRef.current,
      hasCachedData: hasCachedData(),
      cacheSize: Object.keys(navigationCache).length,
    };
  }, [routePath, hasCachedData]);

  // Update component state reference
  const updateComponentState = useCallback((state: any) => {
    if (preserveComponentState) {
      componentStateRef.current = state;
    }
  }, [preserveComponentState]);

  return {
    isReturning: isReturningRef.current,
    hasCachedData: hasCachedData(),
    cachedComponentState: componentStateRef.current,
    saveNavigationState,
    restoreNavigationState,
    clearNavigationCache,
    getCacheStats,
    updateComponentState,
  };
}
