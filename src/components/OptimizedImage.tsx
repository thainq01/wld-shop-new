import React, { memo, useState, useCallback } from "react";
import { useProductImage } from "../hooks/useOptimizedImage";

export interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fallbackContent?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: string) => void;
  extractColor?: boolean;
  fill?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "scale-down" | "none";
  eager?: boolean; // For above-the-fold images like hero sections
}

/**
 * Optimized image component with color extraction and caching
 * Prevents re-loading and provides seamless background color matching
 */
export const OptimizedImage = memo<OptimizedImageProps>(
  ({
    src,
    alt,
    className = "",
    fallbackClassName = "",
    fallbackContent,
    onLoad,
    onError,
    extractColor = true,
    fill = false,
    objectFit = "cover",
    eager = false,
  }) => {
    const [imageError, setImageError] = useState(false);
    const { isLoaded, error, backgroundStyle } = useProductImage(src);

    const handleImageLoad = useCallback(() => {
      setImageError(false);
      onLoad?.();
    }, [onLoad]);

    const handleImageError = useCallback(() => {
      setImageError(true);
      onError?.(error || "Failed to load image");
    }, [error, onError]);

    // If no src provided, show fallback
    if (!src) {
      return (
        <div
          className={`${fallbackClassName} flex items-center justify-center bg-gray-200 dark:bg-gray-700`}
        >
          {fallbackContent || (
            <span className="text-gray-400 dark:text-gray-500 text-lg font-medium">
              No Image
            </span>
          )}
        </div>
      );
    }

    // If image failed to load, show fallback
    if (imageError || error) {
      return (
        <div
          className={`${fallbackClassName} flex items-center justify-center bg-gray-200 dark:bg-gray-700`}
        >
          {fallbackContent || (
            <span className="text-gray-400 dark:text-gray-500 text-lg font-medium">
              {alt.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      );
    }

    const imageClasses = `
    ${className}
    ${fill ? "w-full h-full" : ""}
    ${objectFit === "cover" ? "object-cover" : ""}
    ${objectFit === "contain" ? "object-contain" : ""}
    ${objectFit === "fill" ? "object-fill" : ""}
    ${objectFit === "scale-down" ? "object-scale-down" : ""}
    ${objectFit === "none" ? "object-none" : ""}
    transition-opacity duration-300
    ${isLoaded ? "opacity-100" : "opacity-0"}
  `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <div className="relative w-full h-full">
        {/* Background with extracted color - lowest z-index */}
        {extractColor && (
          <div
            className="absolute inset-0 transition-all duration-500 z-0"
            style={{
              background:
                backgroundStyle ||
                "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
            }}
          />
        )}

        {/* Blur-up placeholder */}
        {!isLoaded && (
          <div
            className="absolute inset-0 z-5 bg-gray-100 dark:bg-gray-800"
            style={{
              filter: "blur(20px)",
              transform: "scale(1.1)",
              opacity: 1,
              transition: "opacity 400ms ease-out",
            }}
          />
        )}

        {/* Actual image */}
        <img
          src={src}
          alt={alt}
          className={`${imageClasses} z-10`}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 400ms ease-out",
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

/**
 * Specialized component for hero section images that fill the entire space
 */
export const HeroImage = memo<
  Omit<OptimizedImageProps, "fill" | "objectFit" | "extractColor"> & {
    eager?: boolean;
  }
>(
  ({
    src,
    alt,
    className = "",
    fallbackClassName = "",
    fallbackContent,
    onLoad,
    onError,
    eager = false, // Hero images should use lazy loading for better performance
  }) => {
    return (
      <OptimizedImage
        src={src}
        alt={alt}
        className={`absolute inset-0 ${className}`}
        fallbackClassName={`absolute inset-0 ${fallbackClassName}`}
        fallbackContent={fallbackContent}
        onLoad={onLoad}
        onError={onError}
        fill={true}
        objectFit="cover"
        extractColor={true}
        eager={eager}
      />
    );
  }
);

HeroImage.displayName = "HeroImage";

/**
 * Product image component with consistent styling
 */
export const ProductImage = memo<{
  src: string | null | undefined;
  alt: string;
  size?: "small" | "medium" | "large" | "full";
  className?: string;
  rounded?: boolean;
  shadow?: boolean;
}>(
  ({
    src,
    alt,
    size = "medium",
    className = "",
    rounded = true,
    shadow = true,
  }) => {
    const sizeClasses = {
      small: "w-16 h-16",
      medium: "w-32 h-32",
      large: "w-48 h-48",
      full: "w-full h-full",
    };

    const baseClasses = `
    ${sizeClasses[size]}
    ${rounded ? "rounded-xl" : ""}
    ${shadow ? "shadow-lg" : ""}
    ${className}
  `
      .trim()
      .replace(/\s+/g, " ");

    const fallbackClasses = `
    ${sizeClasses[size]}
    ${rounded ? "rounded-xl" : ""}
    ${shadow ? "shadow-lg" : ""}
    ${className}
  `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <OptimizedImage
        src={src}
        alt={alt}
        className={baseClasses}
        fallbackClassName={fallbackClasses}
        fallbackContent={
          <span className="text-gray-600 dark:text-gray-300 text-2xl font-bold">
            {alt.charAt(0).toUpperCase()}
          </span>
        }
        fill={size === "full"}
        objectFit="cover"
        extractColor={false}
        eager={false} // Product images use lazy loading
      />
    );
  }
);

ProductImage.displayName = "ProductImage";
