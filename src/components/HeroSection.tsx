import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { productsApi } from "../utils/api";
import { useLanguageStore } from "../store/languageStore";
import { Product } from "../types";
import { Language } from "./Language";
import { ThemeMode } from "./ThemeMode";

// Helper function to get product image
function getProductImage(product: Product): string {
  if (!product.images || product.images.length === 0) return "";

  // Find primary image
  const primaryImage = product.images.find((img) => img.isPrimary);
  if (primaryImage) return primaryImage.url;

  // Fallback to first image
  return product.images[0]?.url || "";
}

export function HeroSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isManualControl, setIsManualControl] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentLanguage } = useLanguageStore();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const products = await productsApi.getAll({
          lang: currentLanguage,
          country: currentLanguage,
          active: true,
        });
        // Filter only featured products
        const featured = products.filter(product => product.featured);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
        setFeaturedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [currentLanguage]);

  useEffect(() => {
    if (isManualControl) {
      const resetTimer = setTimeout(() => {
        setIsManualControl(false);
      }, 2500);
      return () => clearTimeout(resetTimer);
    }

    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 2500);

    return () => clearInterval(intervalId);
  }, [isManualControl, featuredProducts.length]);

  const handleManualSlide = (index: number) => {
    setCurrentSlide(index);
    setIsManualControl(true);
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
            {t('explore')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
            Featured Products
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
                    No Featured Products
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">
                    Check back later for featured items
                  </p>
                </div>
              </div>
            ) : (
              featuredProducts.map((product) => {
                const productImage = getProductImage(product);
                return (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="w-full flex-shrink-0 relative bg-white dark:bg-gray-900 h-full overflow-hidden cursor-pointer active:scale-95 transition-transform duration-150"
                  >
                    {/* Clean background with subtle pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"></div>

                    {/* Mobile-optimized content container */}
                    <div className="relative h-full flex flex-col">
                      {/* Product image section - Centered and larger */}
                      <div className="flex-1 flex items-center justify-center p-3 sm:p-6">
                        <div className="relative">
                          {productImage ? (
                            <div className="relative">
                              <img
                                src={productImage}
                                alt={product.name}
                                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-xl sm:rounded-2xl shadow-lg border border-white dark:border-gray-700"
                              />
                              {/* Featured badge - smaller for mobile */}
                              <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-bold shadow-md">
                                ★
                              </div>
                            </div>
                          ) : (
                            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg border border-white dark:border-gray-700">
                              <span className="text-gray-600 dark:text-gray-300 text-2xl sm:text-3xl md:text-4xl font-bold">
                                {product.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Minimal product info - Mobile optimized */}
                      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-3 sm:p-4">
                        <div className="">
                          <h3 className="text-gray-900 dark:text-white text-sm sm:text-base md:text-lg font-semibold mb-1 leading-tight truncate">
                            {product.name || "Product Name"}
                          </h3>
                          <div className=" sm:justify-start gap-2">
                            <span className="text-gray-500 dark:text-gray-400 sm:text-sm text-base font-semibold">
                              {product.effectivePrice || product.countryPrice || product.basePrice || product.price} WLD
                            </span>
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
