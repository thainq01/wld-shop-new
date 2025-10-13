import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Product } from "../types";
import { Language } from "./Language";
import { ThemeMode } from "./ThemeMode";
import { useCollectionStore } from "../store/collectionStore";
import { useImagePreloader } from "../hooks/useOptimizedImage";
import { getHeroImageUrl } from "../utils/imageOptimization";
import { useNavigationCache } from "../hooks/useNavigationCache";
import { BlurUpImage } from "./BlurUpImage";

// Memoized helper function to get product image
const getProductImage = (product: Product): string => {
  if (!product.images || product.images.length === 0) return "";

  // Find primary image
  const primaryImage = product.images.find((img) => img.isPrimary);
  if (primaryImage) return primaryImage.url;

  // Fallback to first image
  return product.images[0]?.url || "";
};

export function HeroSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Enhanced navigation caching for hero section state
  const { isReturning, updateComponentState } = useNavigationCache(
    "/explore/hero",
    {
      enableCache: true,
      cacheTimeout: 10 * 60 * 1000, // 10 minutes
      preserveComponentState: true,
    }
  );

  // Persist current slide state to prevent jumping back to 0 when returning from other screens
  const currentSlideRef = useRef(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isManualControl, setIsManualControl] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Use collection store for featured products - this will use cache when available
  const {
    fetchFeaturedProducts,
    getFeaturedProducts,
    isFeaturedProductsLoading,
  } = useCollectionStore();

  const featuredProducts = getFeaturedProducts();
  const isLoading = isFeaturedProductsLoading();

  // Memoize product images to prevent re-computation on every render
  const productImages = useMemo(() => {
    return featuredProducts.map((product) => ({
      id: product.id,
      url: getHeroImageUrl(getProductImage(product)), // Optimize image URL for hero display
      alt: product.name || "Product Image",
    }));
  }, [featuredProducts]);

  // Preload all product images for better performance
  const imageUrls = useMemo(
    () => productImages.map((img) => img.url).filter(Boolean),
    [productImages]
  );

  // Preload images in background for better performance
  const { isPreloading, failedUrls, successRate } =
    useImagePreloader(imageUrls);

  // Log preloading performance for debugging
  useEffect(() => {
    if (!isPreloading && imageUrls.length > 0) {
      console.log(
        `Image preloading completed: ${successRate.toFixed(1)}% success rate`
      );
      if (failedUrls.length > 0) {
        console.warn("Failed to preload images:", failedUrls);
      }
    }
  }, [isPreloading, successRate, failedUrls, imageUrls.length]);

  // Fetch featured products on component mount
  useEffect(() => {
    // This will only fetch if not already cached
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  // Auto-slide effect with proper state management
  useEffect(() => {
    if (!featuredProducts.length) return;

    // Don't auto-slide immediately when returning to page
    if (isReturning && isManualControl) {
      return;
    }

    if (isManualControl) {
      const resetTimer = setTimeout(() => {
        setIsManualControl(false);
      }, 2500);
      return () => clearTimeout(resetTimer);
    }

    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % featuredProducts.length;
        currentSlideRef.current = nextSlide;
        return nextSlide;
      });
    }, 2500);

    return () => clearInterval(intervalId);
  }, [isManualControl, featuredProducts.length, isReturning]);

  // Initialize current slide from ref when featured products are loaded
  useEffect(() => {
    if (
      featuredProducts.length > 0 &&
      currentSlide === 0 &&
      currentSlideRef.current > 0
    ) {
      // Restore the previous slide position if we had one
      setCurrentSlide(
        Math.min(currentSlideRef.current, featuredProducts.length - 1)
      );
    }
  }, [featuredProducts.length, currentSlide]);

  const handleManualSlide = (index: number) => {
    setCurrentSlide(index);
    currentSlideRef.current = index;
    setIsManualControl(true);

    // Update component state in navigation cache
    updateComponentState({
      currentSlide: index,
      isManualControl: true,
      timestamp: Date.now(),
    });
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    // Only handle swipe if there's significant movement
    if (isLeftSwipe || isRightSwipe) {
      e.preventDefault(); // Prevent click event when swiping

      if (isLeftSwipe) {
        const nextSlide = (currentSlide + 1) % featuredProducts.length;
        handleManualSlide(nextSlide);
      }

      if (isRightSwipe) {
        const prevSlide =
          currentSlide === 0 ? featuredProducts.length - 1 : currentSlide - 1;
        handleManualSlide(prevSlide);
      }
    }
  };

  return (
    <div className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 pb-4 sm:pb-6 md:pb-8">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t("explore")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
            {t("featuredProducts")}
          </p>
        </div>
        <div className="flex flex-row items-center justify-end gap-2">
          <Language />
          <ThemeMode />
        </div>
      </div>

      <div className="relative">
        {/* Modern card container - Mobile responsive */}
        <div className="rounded-xl sm:rounded-2xl overflow-hidden dark:border-gray-700 aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/10]">
          {/* Sliding content container */}
          <div
            className="flex transition-transform duration-300 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {isLoading ? (
              // Loading state
              <div className="w-full flex-shrink-0 relative bg-gray-200 dark:bg-gray-700 h-full animate-pulse">
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                  </div>
                  <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-full w-24"></div>
                </div>
              </div>
            ) : featuredProducts.length === 0 ? (
              // No featured products state
              <div className="w-full flex-shrink-0 relative bg-gray-100 dark:bg-gray-800 h-full flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-gray-600 dark:text-gray-400 text-xl font-medium mb-2">
                    {t("noFeaturedProducts")}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">
                    {t("checkBackLater")}
                  </p>
                </div>
              </div>
            ) : (
              featuredProducts.map((product, index) => {
                const productImageData = productImages[index];
                return (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="w-full flex-shrink-0 relative h-full overflow-hidden cursor-pointer active:scale-95 transition-transform duration-150"
                  >
                    {/* Full-space product image with extracted background color - z-index 10 */}
                    <BlurUpImage
                      src={productImageData?.url}
                      alt={productImageData?.alt || product.name}
                      className="w-full h-full"
                      eager={false}
                    />

                    {/* Overlay gradient for better text readability - z-index 20 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-20 pointer-events-none" />

                    {/* Featured badge - positioned at top right - z-index 30 */}
                    <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold shadow-lg z-30">
                      ★ {t("featured")}
                    </div>

                    {/* Product info overlay - positioned at bottom - z-index 30 */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-30">
                      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                        <h3 className="text-gray-900 dark:text-white text-lg sm:text-xl font-bold mb-2 leading-tight">
                          {product.name || "Product Name"}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-300 text-base sm:text-lg font-semibold">
                            {product.effectivePrice ||
                              product.countryPrice ||
                              product.basePrice ||
                              product.price}{" "}
                            WLD
                          </span>
                          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                            <span className="mr-1">{t("viewProduct")}</span>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Compact slide indicators for mobile */}
        {featuredProducts.length > 1 && (
          <div className="flex justify-center gap-2 mt-4 sm:mt-6">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => handleManualSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? "w-6 h-2 sm:w-8 sm:h-3 bg-gray-900 dark:bg-gray-100"
                    : "w-2 h-2 sm:w-3 sm:h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
