/**
 * Image optimization utilities for better performance
 * Handles S3 image optimization, format conversion, and caching
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "jpeg" | "png" | "auto";
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
}

/**
 * Check if the browser supports WebP format
 */
export function supportsWebP(): boolean {
  if (typeof window === "undefined") return false;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
}

/**
 * Check if the browser supports AVIF format
 */
export function supportsAVIF(): boolean {
  if (typeof window === "undefined") return false;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  return canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0;
}

/**
 * Get the best supported image format for the browser
 */
export function getBestImageFormat(): "avif" | "webp" | "jpeg" {
  if (supportsAVIF()) return "avif";
  if (supportsWebP()) return "webp";
  return "jpeg";
}

/**
 * Optimize S3 image URL for better performance
 * For S3 URLs, we avoid adding query parameters that might cause CORS issues
 */
export function optimizeImageUrl(
  originalUrl: string,
  options: ImageOptimizationOptions = {}
): string {
  if (!originalUrl) return originalUrl;

  // For S3 URLs, return the original URL to avoid CORS issues
  // Query parameters on S3 URLs can cause CORS problems and don't provide optimization
  if (isS3Url(originalUrl)) {
    return originalUrl;
  }

  const {
    width,
    height,
    quality = 85,
    format = "auto",
    fit = "cover",
  } = options;

  // For non-S3 URLs, we can add optimization parameters if using a CDN service
  try {
    const url = new URL(originalUrl);

    // Add cache-busting parameter to help with browser caching
    const cacheKey = `w${width || "auto"}_h${
      height || "auto"
    }_q${quality}_f${format}_fit${fit}`;
    url.searchParams.set("opt", cacheKey);

    return url.toString();
  } catch (error) {
    // If URL parsing fails, return original URL
    console.warn("Failed to optimize image URL:", error);
    return originalUrl;
  }
}

/**
 * Generate responsive image URLs for different screen sizes
 */
export function generateResponsiveImageUrls(originalUrl: string): {
  small: string;
  medium: string;
  large: string;
  original: string;
} {
  return {
    small: optimizeImageUrl(originalUrl, { width: 400, quality: 80 }),
    medium: optimizeImageUrl(originalUrl, { width: 800, quality: 85 }),
    large: optimizeImageUrl(originalUrl, { width: 1200, quality: 90 }),
    original: originalUrl,
  };
}

/**
 * Create a low-quality placeholder image URL for blur-up effect
 */
export function createPlaceholderUrl(originalUrl: string): string {
  return optimizeImageUrl(originalUrl, {
    width: 40,
    height: 30,
    quality: 20,
    format: "jpeg",
  });
}

/**
 * Preload critical images with high priority
 */
export function preloadCriticalImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    link.crossOrigin = "anonymous";

    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to preload ${url}`));

    document.head.appendChild(link);

    // Clean up after 10 seconds
    setTimeout(() => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    }, 10000);
  });
}

/**
 * Add image optimization headers for better caching
 */
export function getOptimizedImageHeaders(): Record<string, string> {
  return {
    "Cache-Control": "public, max-age=31536000, immutable",
    Accept:
      getBestImageFormat() === "webp"
        ? "image/webp,image/avif,image/*,*/*;q=0.8"
        : "image/avif,image/webp,image/*,*/*;q=0.8",
  };
}

/**
 * Check if an image URL is from S3 and might benefit from optimization
 */
export function isS3Url(url: string): boolean {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname.includes("s3") ||
      urlObj.hostname.includes("amazonaws.com") ||
      urlObj.hostname.includes("cloudfront.net")
    );
  } catch {
    return false;
  }
}

/**
 * Get optimized image URL specifically for hero images
 */
export function getHeroImageUrl(originalUrl: string): string {
  if (!originalUrl) return originalUrl;

  // For hero images, we want high quality but optimized format
  return optimizeImageUrl(originalUrl, {
    width: 1200,
    height: 800,
    quality: 90,
    format: "auto",
    fit: "cover",
  });
}

/**
 * Get optimized image URL for thumbnails
 */
export function getThumbnailImageUrl(originalUrl: string): string {
  if (!originalUrl) return originalUrl;

  return optimizeImageUrl(originalUrl, {
    width: 300,
    height: 300,
    quality: 80,
    format: "auto",
    fit: "cover",
  });
}

/**
 * Estimate image load time based on URL and connection
 */
export function estimateLoadTime(url: string): number {
  if (!url) return 0;

  // Basic estimation based on URL characteristics
  const isS3 = isS3Url(url);
  const baseTime = isS3 ? 2000 : 1000; // S3 images typically take longer

  // Adjust based on connection quality if available
  if ("connection" in navigator) {
    const connection = (navigator as any).connection;
    if (connection) {
      switch (connection.effectiveType) {
        case "slow-2g":
          return baseTime * 4;
        case "2g":
          return baseTime * 3;
        case "3g":
          return baseTime * 2;
        case "4g":
        default:
          return baseTime;
      }
    }
  }

  return baseTime;
}
