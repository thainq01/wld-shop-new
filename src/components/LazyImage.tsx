import React, { memo } from 'react';
import { useLazyImage, LazyImagePlaceholder } from '../hooks/useLazyLoading';
import { isS3Url } from '../utils/imageOptimization';

export interface LazyImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  eager?: boolean; // For above-the-fold images like hero sections
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * LazyImage component with Intersection Observer for optimal loading
 * Uses native lazy loading as fallback and Intersection Observer for more control
 */
export const LazyImage = memo<LazyImageProps>(
  ({
    src,
    alt,
    className = '',
    placeholderClassName = '',
    eager = false,
    rootMargin = '300px',
    onLoad,
    onError,
  }) => {
    const {
      containerRef,
      shouldLoad,
      isLoaded,
      isLoading,
      error,
      handleImageLoad,
      handleImageError,
    } = useLazyImage({
      rootMargin,
      triggerOnce: true,
    });

    // Handle load/error callbacks
    const handleLoad = () => {
      handleImageLoad();
      onLoad?.();
    };

    const handleErr = () => {
      handleImageError();
      onError?.();
    };

    // If no src provided, show placeholder
    if (!src) {
      return (
        <div ref={containerRef} className={`relative ${className}`}>
          <LazyImagePlaceholder 
            className={`absolute inset-0 ${placeholderClassName}`}
            showSpinner={false}
          />
        </div>
      );
    }

    return (
      <div ref={containerRef} className={`relative ${className}`}>
        {/* Show placeholder while loading or before intersection */}
        {(!shouldLoad || isLoading) && !isLoaded && (
          <LazyImagePlaceholder 
            className={`absolute inset-0 z-10 ${placeholderClassName}`}
            showSpinner={isLoading}
          />
        )}

        {/* Show error state */}
        {error && !isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="flex flex-col items-center space-y-2 text-gray-500 dark:text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">Image unavailable</span>
            </div>
          </div>
        )}

        {/* Actual image - render when should load or if eager */}
        {(shouldLoad || eager) && (
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleErr}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            crossOrigin={isS3Url(src) ? undefined : 'anonymous'}
          />
        )}
      </div>
    );
  }
);

LazyImage.displayName = 'LazyImage';

/**
 * Specialized component for hero images (eager loading)
 */
export const HeroLazyImage = memo<Omit<LazyImageProps, 'eager'>>(
  (props) => {
    return <LazyImage {...props} eager={true} />;
  }
);

HeroLazyImage.displayName = 'HeroLazyImage';

/**
 * Specialized component for product images (lazy loading)
 */
export const ProductLazyImage = memo<LazyImageProps>(
  (props) => {
    return <LazyImage {...props} eager={false} rootMargin="200px" />;
  }
);

ProductLazyImage.displayName = 'ProductLazyImage';

/**
 * Specialized component for thumbnail images (lazy loading with smaller margin)
 */
export const ThumbnailLazyImage = memo<LazyImageProps>(
  (props) => {
    return <LazyImage {...props} eager={false} rootMargin="100px" />;
  }
);

ThumbnailLazyImage.displayName = 'ThumbnailLazyImage';
