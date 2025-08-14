import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../store/productStore";

// Slide configurations that map to API data
const slideConfigs = [
  {
    id: 1,
    title: "Core Collection",
    subtitle: "Essential pieces",
    bgColor: "from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700",
    product: "hoodie",
  },
  {
    id: 2,
    title: "Limited Drop",
    subtitle: "Exclusive items",
    bgColor: "from-blue-300 to-blue-400 dark:from-blue-600 dark:to-blue-700",
    product: "tshirt",
  },
  {
    id: 3,
    title: "Accessories",
    subtitle: "Complete your look",
    bgColor:
      "from-green-300 to-green-400 dark:from-green-600 dark:to-green-700",
    product: "hat",
  },
  {
    id: 4,
    title: "Premium Line",
    subtitle: "Luxury collection",
    bgColor:
      "from-purple-300 to-purple-400 dark:from-purple-600 dark:to-purple-700",
    product: "crewneck",
  },
  {
    id: 5,
    title: "Featured",
    subtitle: "Trending now",
    bgColor:
      "from-orange-300 to-orange-400 dark:from-orange-600 dark:to-orange-700",
    product: "bot-hat",
  },
];

function ProductIllustration({ type }: { type: string }) {
  switch (type) {
    case "hoodie":
      return (
        <div className="relative">
          {/* Hood */}
          <div className="w-32 h-20 bg-black rounded-t-full mx-auto"></div>
          {/* Body */}
          <div className="w-40 h-32 bg-black rounded-t-3xl -mt-2"></div>
          {/* Arms */}
          <div className="absolute top-6 -left-6 w-12 h-24 bg-black rounded-l-2xl"></div>
          <div className="absolute top-6 -right-6 w-12 h-24 bg-black rounded-r-2xl"></div>
          {/* Pocket */}
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gray-800 rounded"></div>
          {/* Text on hoodie */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
            <div className="text-white text-xs font-mono bg-gray-800 px-2 py-1 rounded">
              unique human
            </div>
          </div>
        </div>
      );
    case "tshirt":
      return (
        <div className="relative">
          <div className="w-32 h-40 bg-black rounded-t-lg mx-auto"></div>
          <div className="absolute -top-2 left-4 w-6 h-12 bg-black rounded-t-lg"></div>
          <div className="absolute -top-2 right-4 w-6 h-12 bg-black rounded-t-lg"></div>
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
            <div className="text-white text-xs font-mono bg-gray-800 px-2 py-1 rounded">
              unique human
            </div>
          </div>
        </div>
      );
    case "hat":
      return (
        <div className="relative">
          <div className="w-28 h-16 bg-black rounded-full mx-auto"></div>
          <div className="w-32 h-3 bg-black rounded-full mx-auto mt-1"></div>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
            <div className="text-white text-xs font-mono bg-gray-800 px-2 py-1 rounded">
              unique human
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export function HeroSection() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isManualControl, setIsManualControl] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const { sliderProducts, isLoadingSlider, fetchSliderProducts } =
    useProductStore();

  useEffect(() => {
    if (sliderProducts.length === 0) {
      fetchSliderProducts();
    }
  }, [sliderProducts.length, fetchSliderProducts]);

  useEffect(() => {
    if (isManualControl) {
      const resetTimer = setTimeout(() => {
        setIsManualControl(false);
      }, 3000);
      return () => clearTimeout(resetTimer);
    }

    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideConfigs.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isManualControl]);

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

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      const nextSlide = (currentSlide + 1) % slideConfigs.length;
      handleManualSlide(nextSlide);
    }

    if (isRightSwipe) {
      const prevSlide =
        currentSlide === 0 ? slideConfigs.length - 1 : currentSlide - 1;
      handleManualSlide(prevSlide);
    }
  };

  return (
    <div className="px-4 pt-6 pb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Explore
      </h2>

      <div className="relative">
        {/* Fixed border container */}
        <div className="rounded-3xl overflow-hidden aspect-[4/3]">
          {/* Sliding content container */}
          <div
            className="flex transition-transform duration-300 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {isLoadingSlider ? (
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
            ) : (
              slideConfigs.map((collection) => (
                <div
                  key={collection.id}
                  className={`w-full flex-shrink-0 relative bg-gradient-to-b ${collection.bgColor} h-full`}
                >
                  {/* Product illustration */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ProductIllustration type={collection.product} />
                  </div>

                  {/* Overlay content */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                    <div>
                      <h3 className="text-white text-2xl font-bold mb-1">
                        {collection.title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {collection.subtitle}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        navigate(
                          `/collection/${encodeURIComponent(collection.title)}`
                        )
                      }
                      className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
                    >
                      Explore
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {slideConfigs.map((_, index) => (
            <button
              key={index}
              onClick={() => handleManualSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide
                  ? "bg-gray-900 dark:bg-gray-100"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
