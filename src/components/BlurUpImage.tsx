import React, { useState, useEffect } from "react";

export interface BlurUpImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  eager?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * BlurUpImage component that implements blur-up lazy loading technique
 * Shows a blurred placeholder that smoothly transitions to sharp image
 */
export const BlurUpImage: React.FC<BlurUpImageProps> = ({
  src,
  alt,
  className = "",
  placeholderClassName = "",
  eager = false,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(eager);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (eager || !src) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px", // Start loading 50px before entering viewport
        threshold: 0.1,
      }
    );

    const element = document.getElementById(`blur-up-${src}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [src, eager]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
    onError?.();
  };

  if (!src) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <div
          className={`absolute inset-0 bg-gray-300 dark:bg-gray-600 flex items-center justify-center ${placeholderClassName}`}
        >
          <span className="text-gray-500 dark:text-gray-400 text-xs text-center px-2">
            No Image
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`blur-up-${src}`}
      className={`relative w-full h-full ${className}`}
    >
      {/* Blurred placeholder background */}
      <div
        className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 ${placeholderClassName}`}
        style={{
          filter: "blur(20px)",
          transform: "scale(1.1)", // Slightly larger to hide blur edges
          opacity: isLoaded ? 0 : 1,
          transition: "opacity 500ms ease-out",
        }}
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400 text-xs text-center px-2">
            Failed to load
          </span>
        </div>
      )}

      {/* Actual image - only render when in view or eager */}
      {(isInView || eager) && (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 500ms ease-out",
          }}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};

/**
 * Specialized version for hero images (eager loading)
 */
export const HeroBlurUpImage: React.FC<Omit<BlurUpImageProps, "eager">> = (
  props
) => {
  return <BlurUpImage {...props} eager={true} />;
};

/**
 * Specialized version for product images (lazy loading)
 */
export const ProductBlurUpImage: React.FC<BlurUpImageProps> = (props) => {
  return <BlurUpImage {...props} eager={false} />;
};

/**
 * Enhanced version with gradient overlay for better text readability
 */
export const BlurUpImageWithGradient: React.FC<
  BlurUpImageProps & {
    gradientDirection?: "top" | "bottom" | "left" | "right";
    gradientOpacity?: number;
  }
> = ({ gradientDirection = "bottom", gradientOpacity = 0.6, ...props }) => {
  const gradientClasses = {
    top: `bg-gradient-to-b from-black/${Math.round(
      gradientOpacity * 100
    )} to-transparent`,
    bottom: `bg-gradient-to-t from-black/${Math.round(
      gradientOpacity * 100
    )} to-transparent`,
    left: `bg-gradient-to-r from-black/${Math.round(
      gradientOpacity * 100
    )} to-transparent`,
    right: `bg-gradient-to-l from-black/${Math.round(
      gradientOpacity * 100
    )} to-transparent`,
  };

  return (
    <div className="relative w-full h-full">
      <BlurUpImage {...props} />
      <div
        className={`absolute inset-0 ${gradientClasses[gradientDirection]} pointer-events-none`}
      />
    </div>
  );
};
