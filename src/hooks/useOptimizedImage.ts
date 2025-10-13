import { useState, useEffect, useCallback, useRef } from "react";
import {
  extractDominantColorCached,
  DominantColorResult,
  getThemeAwareBackground,
} from "../utils/colorExtraction";
import { useTheme } from "./useTheme";
import { isS3Url } from "../utils/imageOptimization";

export interface OptimizedImageState {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  dominantColor: DominantColorResult | null;
  backgroundStyle: string;
}

interface UseOptimizedImageOptions {
  extractColor?: boolean;
  preload?: boolean;
  fallbackColor?: string;
}

/**
 * Hook for optimized image loading with color extraction and caching
 * Prevents image re-loading and provides dominant color extraction
 */
export function useOptimizedImage(
  imageUrl: string | null | undefined,
  options: UseOptimizedImageOptions = {}
): OptimizedImageState {
  const {
    extractColor: shouldExtractColor = true,
    preload = true,
    fallbackColor = "rgb(240, 240, 240)",
  } = options;
  const { theme } = useTheme();

  const [state, setState] = useState<OptimizedImageState>({
    isLoaded: false,
    isLoading: false,
    error: null,
    dominantColor: null,
    backgroundStyle: fallbackColor,
  });

  // Cache for loaded images to prevent re-loading
  const imageCache = useRef(new Map<string, HTMLImageElement>());
  const colorExtractionCache = useRef(new Map<string, DominantColorResult>());

  // Memoized image loading function
  const loadImage = useCallback(async (url: string) => {
    // Check if image is already cached
    if (imageCache.current.has(url)) {
      const cachedImage = imageCache.current.get(url)!;
      if (cachedImage.complete && cachedImage.naturalWidth > 0) {
        setState((prev) => ({
          ...prev,
          isLoaded: true,
          isLoading: false,
          error: null,
        }));
        return cachedImage;
      }
    }

    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();

      // Only set crossOrigin for non-S3 URLs to avoid CORS issues
      if (!isS3Url(url)) {
        img.crossOrigin = "anonymous";
      }

      // Add cache-friendly headers and timeout for slow S3 images
      img.referrerPolicy = "no-referrer-when-downgrade";

      const timeout = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        reject(new Error("Image load timeout"));
      }, 15000); // 15 second timeout

      img.onload = () => {
        clearTimeout(timeout);

        // Verify image loaded successfully
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
          reject(new Error("Invalid image dimensions"));
          return;
        }

        // Cache the loaded image
        imageCache.current.set(url, img);

        // Limit cache size with LRU-style eviction
        if (imageCache.current.size > 30) {
          const firstKey = imageCache.current.keys().next().value;
          if (firstKey) {
            imageCache.current.delete(firstKey);
          }
        }

        setState((prev) => ({
          ...prev,
          isLoaded: true,
          isLoading: false,
          error: null,
        }));
        resolve(img);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        const error = "Failed to load image";
        setState((prev) => ({
          ...prev,
          isLoaded: false,
          isLoading: false,
          error,
        }));
        reject(new Error(error));
      };

      img.src = url;
    });
  }, []);

  // Memoized color extraction function
  const extractColorFromImage = useCallback(
    async (url: string) => {
      // Check cache first
      if (colorExtractionCache.current.has(url)) {
        const cachedColor = colorExtractionCache.current.get(url)!;
        const backgroundStyle = getThemeAwareBackground(
          cachedColor,
          theme === "dark"
        );
        setState((prev) => ({
          ...prev,
          dominantColor: cachedColor,
          backgroundStyle,
        }));
        return;
      }

      try {
        // Skip color extraction for S3 URLs to avoid CORS issues
        if (isS3Url(url)) {
          console.log(
            "Skipping color extraction for S3 URL to avoid CORS issues"
          );
          return;
        }

        const dominantColor = await extractDominantColorCached(url);

        // Cache the result
        colorExtractionCache.current.set(url, dominantColor);

        // Limit cache size
        if (colorExtractionCache.current.size > 20) {
          const firstKey = colorExtractionCache.current.keys().next().value;
          if (firstKey) {
            colorExtractionCache.current.delete(firstKey);
          }
        }

        const backgroundStyle = getThemeAwareBackground(
          dominantColor,
          theme === "dark"
        );
        setState((prev) => ({ ...prev, dominantColor, backgroundStyle }));
      } catch (error) {
        console.warn("Color extraction failed:", error);
        // Keep fallback background on error
      }
    },
    [theme]
  );

  // Update background style when theme changes
  useEffect(() => {
    if (state.dominantColor) {
      const backgroundStyle = getThemeAwareBackground(
        state.dominantColor,
        theme === "dark"
      );
      setState((prev) => ({ ...prev, backgroundStyle }));
    }
  }, [theme, state.dominantColor]);

  // Main effect for loading image and extracting color
  useEffect(() => {
    if (!imageUrl) {
      setState({
        isLoaded: false,
        isLoading: false,
        error: null,
        dominantColor: null,
        backgroundStyle: fallbackColor,
      });
      return;
    }

    // Reset state for new image
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      backgroundStyle: prev.dominantColor
        ? prev.backgroundStyle
        : fallbackColor,
    }));

    const loadAndExtract = async () => {
      try {
        // For lazy loading, we don't preload - let the browser handle it
        // Just set loaded state and extract color if needed
        setState((prev) => ({ ...prev, isLoaded: true, isLoading: false }));

        // Extract color if requested
        if (shouldExtractColor && imageUrl) {
          await extractColorFromImage(imageUrl);
        }
      } catch (error) {
        console.warn("Image optimization failed:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }));
      }
    };

    loadAndExtract();
  }, [
    imageUrl,
    preload,
    shouldExtractColor,
    loadImage,
    extractColorFromImage,
    fallbackColor,
  ]);

  return state;
}

/**
 * Hook specifically for product images with optimized defaults
 */
export function useProductImage(imageUrl: string | null | undefined) {
  return useOptimizedImage(imageUrl, {
    extractColor: true,
    preload: true,
    fallbackColor:
      "linear-gradient(135deg, rgb(240, 240, 240), rgb(220, 220, 220))",
  });
}

/**
 * Preload multiple images for better performance
 */
export function useImagePreloader(imageUrls: string[]) {
  const [preloadedCount, setPreloadedCount] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);
  const [failedUrls, setFailedUrls] = useState<string[]>([]);

  useEffect(() => {
    if (imageUrls.length === 0) return;

    setIsPreloading(true);
    setPreloadedCount(0);
    setFailedUrls([]);

    // Preload images with staggered loading to avoid overwhelming the network
    const preloadWithDelay = async () => {
      const results = await Promise.allSettled(
        imageUrls.map((url, index) => {
          return new Promise<void>((resolve, reject) => {
            // Stagger requests by 100ms to avoid overwhelming S3
            setTimeout(() => {
              const img = new Image();

              // Only set crossOrigin for non-S3 URLs to avoid CORS issues
              if (!isS3Url(url)) {
                img.crossOrigin = "anonymous";
              }

              img.referrerPolicy = "no-referrer-when-downgrade";

              const timeout = setTimeout(() => {
                img.onload = null;
                img.onerror = null;
                reject(new Error(`Timeout loading ${url}`));
              }, 10000); // 10 second timeout for preloading

              img.onload = () => {
                clearTimeout(timeout);
                setPreloadedCount((prev) => prev + 1);
                resolve();
              };

              img.onerror = () => {
                clearTimeout(timeout);
                setFailedUrls((prev) => [...prev, url]);
                setPreloadedCount((prev) => prev + 1);
                reject(new Error(`Failed to load ${url}`));
              };

              img.src = url;
            }, index * 100); // 100ms delay between each image
          });
        })
      );

      // Log failed preloads for debugging
      const failed = results.filter((result) => result.status === "rejected");
      if (failed.length > 0) {
        console.warn(`Failed to preload ${failed.length} images:`, failed);
      }

      setIsPreloading(false);
    };

    preloadWithDelay();
  }, [imageUrls]);

  return {
    preloadedCount,
    totalImages: imageUrls.length,
    isPreloading,
    failedUrls,
    progress:
      imageUrls.length > 0 ? (preloadedCount / imageUrls.length) * 100 : 0,
    successRate:
      imageUrls.length > 0
        ? ((preloadedCount - failedUrls.length) / imageUrls.length) * 100
        : 0,
  };
}
