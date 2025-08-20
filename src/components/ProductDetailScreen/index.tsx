import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ShoppingBag,
  ChevronDown,
  Share,
  UserRoundCheck,
  Package,
  Shirt,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ExpandableSection } from "./types";
import { useCartStore } from "../../store/cartStore";
import { useProductStore } from "../../store/productStore";
import { type ProductImage, type ProductSize } from "../../types";

// Product image component - reused from other components
function ProductImage({
  type,
  className = "",
}: {
  type: string;
  className?: string;
}) {
  const baseClasses = `w-full h-full bg-black flex items-center justify-center ${className}`;

  switch (type) {
    case "hoodie-front":
    case "hoodie-back":
    case "hoodie-detail":
    case "hoodie":
      return (
        <div className={baseClasses}>
          <div className="relative">
            <div className="w-20 h-12 bg-black border-2 border-gray-600 rounded-t-full mx-auto"></div>
            <div className="w-24 h-20 bg-black border-2 border-gray-600 rounded-t-2xl -mt-1 mx-auto"></div>
            <div className="absolute top-4 -left-4 w-8 h-16 bg-black border-2 border-gray-600 rounded-l-xl"></div>
            <div className="absolute top-4 -right-4 w-8 h-16 bg-black border-2 border-gray-600 rounded-r-xl"></div>
            {type.includes("front") && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-xs text-white font-mono">
                unique human
              </div>
            )}
          </div>
        </div>
      );
    case "tshirt-front":
    case "tshirt-back":
    case "tshirt-detail":
    case "tshirt":
      return (
        <div className={baseClasses}>
          <div className="relative">
            <div className="w-20 h-24 bg-black border-2 border-gray-600 rounded-t-lg mx-auto"></div>
            <div className="absolute -top-2 -left-4 w-8 h-10 bg-black border-2 border-gray-600 rounded-t-lg"></div>
            <div className="absolute -top-2 -right-4 w-8 h-10 bg-black border-2 border-gray-600 rounded-t-lg"></div>
          </div>
        </div>
      );
    case "hat-front":
    case "hat-side":
    case "hat-detail":
    case "hat":
      return (
        <div className={baseClasses}>
          <div className="relative">
            <div className="w-20 h-10 bg-black border-2 border-gray-600 rounded-full mx-auto"></div>
            <div className="w-24 h-3 bg-black border-2 border-gray-600 rounded-full mt-1 mx-auto"></div>
          </div>
        </div>
      );
    case "crewneck-front":
    case "crewneck-back":
    case "crewneck-detail":
    case "crewneck":
      return (
        <div className={baseClasses}>
          <div className="relative">
            <div className="w-20 h-16 bg-black border-2 border-gray-600 rounded-t-lg mx-auto"></div>
            <div className="w-22 h-20 bg-black border-2 border-gray-600 rounded-t-xl -mt-1 mx-auto"></div>
            <div className="absolute top-3 -left-3 w-6 h-12 bg-black border-2 border-gray-600 rounded-l-lg"></div>
            <div className="absolute top-3 -right-3 w-6 h-12 bg-black border-2 border-gray-600 rounded-r-lg"></div>
          </div>
        </div>
      );
    case "bot-hat-front":
    case "bot-hat-side":
    case "bot-hat-detail":
    case "bot-hat":
      return (
        <div className={baseClasses}>
          <div className="relative">
            <div className="w-20 h-10 bg-black border-2 border-gray-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-xs text-blue-400 font-bold">NOT</span>
            </div>
            <div className="w-24 h-3 bg-black border-2 border-gray-600 rounded-full mt-1 mx-auto"></div>
          </div>
        </div>
      );
    default:
      return <div className={baseClasses}></div>;
  }
}

// Loading component
const LoadingState = () => (
  <div className="min-h-screen bg-white dark:bg-gray-900">
    {/* Header */}
    <div className="flex items-center justify-between p-4">
      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
    </div>

    {/* Image */}
    <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse mx-4 mt-4 rounded-2xl"></div>

    {/* Content */}
    <div className="p-4 space-y-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
  </div>
);

// Error component
const ErrorState = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => (
  <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
    <div className="text-center">
      <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 text-white rounded-lg bg-blue-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Expandable section component
const ExpandableSectionComponent = ({
  title,
  content,
  isExpanded,
  onToggle,
}: {
  title: string;
  content: string;
  isExpanded: boolean;
  onToggle: () => void;
}) => (
  <div>
    <motion.button
      onClick={onToggle}
      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
      className="w-full flex items-center justify-between py-4 text-left"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <motion.div
        className="flex-shrink-0 ml-4"
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </motion.div>
    </motion.button>
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
            opacity: { duration: 0.2 },
          }}
          className="overflow-hidden"
        >
          <div className="pb-4">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {content}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// Size selector component
const SizeSelector = ({
  sizes,
  selectedSize,
  onSizeChange,
  sizeDetails,
}: {
  sizes: string[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
  sizeDetails?: ProductSize[];
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSizeSelect = (size: string) => {
    onSizeChange(size);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Size Selector Button - Inline Style */}
      <motion.button
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 text-gray-900 dark:text-gray-100 focus:outline-none"
      >
        <span className="text-lg font-semibold">
          {selectedSize || "Select Size"}
        </span>
        <motion.div
          animate={{ rotate: isModalOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>

      {/* Size Selection Modal */}
      <AnimatePresence mode="wait">
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-3xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <motion.h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Select size
                </motion.h2>
                <motion.button
                  onClick={() => setIsModalOpen(false)}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    rotate: 90,
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </motion.div>

              {/* Size Options */}
              <motion.div
                className="space-y-3"
                initial="hidden"
                animate="visible"
              >
                {sizes.map((size) => {
                  const sizeDetail = sizeDetails?.find((s) => s.size === size);
                  const isOutOfStock =
                    sizeDetail &&
                    (sizeDetail.stockQuantity === 0 || !sizeDetail.available);

                  return (
                    <motion.button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      variants={{
                        hidden: { opacity: 0, y: 20, scale: 0.95 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: {
                            duration: 0.3,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          },
                        },
                      }}
                      whileHover={{
                        scale: 1.02,
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {size}
                        </span>

                        {sizeDetail &&
                          !isOutOfStock &&
                          sizeDetail.stockQuantity <= 5 && (
                            <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-full">
                              Only {sizeDetail.stockQuantity} left
                            </span>
                          )}
                      </div>
                      <AnimatePresence>
                        {selectedSize === size && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                            transition={{
                              duration: 0.3,
                              ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                            className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center"
                          >
                            <svg
                              className="w-4 h-4 text-white dark:text-black"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const ProductDetailScreen: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const {
    currentProduct: productDetail,
    isLoading,
    error,
    fetchProductDetail,
  } = useProductStore();
  const { addToCart, getCartItemCount } = useCartStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [expandedSections, setExpandedSections] = useState<
    Set<ExpandableSection>
  >(new Set(["about"]));
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Slider functionality states
  const [isManualControl, setIsManualControl] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Fetch product detail when component mounts or productId changes
  useEffect(() => {
    if (productId) {
      fetchProductDetail(productId);
      setCurrentImageIndex(0); // Reset to first image (which will be primary) when product changes
    }
  }, [productId, fetchProductDetail]);

  // Reorder images to show primary image first
  const getOrderedImages = () => {
    if (!productDetail?.images || productDetail.images.length === 0) return [];

    const images = [...productDetail.images];
    const primaryIndex = images.findIndex((img) => img.isPrimary);

    // If there's a primary image and it's not already first, move it to the front
    if (primaryIndex > 0) {
      const primaryImage = images.splice(primaryIndex, 1)[0];
      images.unshift(primaryImage);
    }

    return images;
  };

  const orderedImages = getOrderedImages();

  // Auto-advance images (only if there are multiple images)
  useEffect(() => {
    if (orderedImages.length <= 1) return;

    if (isManualControl) {
      const resetTimer = setTimeout(() => {
        setIsManualControl(false);
      }, 4000); // Longer delay for product images
      return () => clearTimeout(resetTimer);
    }

    const intervalId = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % orderedImages.length);
    }, 4000); // 4 seconds per image

    return () => clearInterval(intervalId);
  }, [isManualControl, orderedImages.length]);

  // Manual image control
  const handleManualImageChange = (index: number) => {
    setCurrentImageIndex(index);
    setIsManualControl(true);
  };

  // Touch gesture handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || orderedImages.length <= 1) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      const nextImage = (currentImageIndex + 1) % orderedImages.length;
      handleManualImageChange(nextImage);
    }

    if (isRightSwipe) {
      const prevImage =
        currentImageIndex === 0
          ? orderedImages.length - 1
          : currentImageIndex - 1;
      handleManualImageChange(prevImage);
    }
  };

  const toggleSection = (section: ExpandableSection) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Get selected size stock information
  const getSelectedSizeStock = () => {
    if (!productDetail?.sizes || !selectedSize) return null;
    return productDetail.sizes.find(
      (size: ProductSize) => size.size === selectedSize
    );
  };

  // Check if selected size is out of stock
  const isSelectedSizeOutOfStock = () => {
    const sizeInfo = getSelectedSizeStock();
    return sizeInfo && (sizeInfo.stockQuantity === 0 || !sizeInfo.available);
  };

  const handleAddToCart = async () => {
    if (!productDetail) return;

    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    // Check if selected size is out of stock
    if (isSelectedSizeOutOfStock()) {
      toast.error("This size is currently out of stock");
      return;
    }

    const primaryImage = productDetail.images?.find(
      (img: ProductImage) => img.isPrimary
    );
    const cartImage = primaryImage?.url || productDetail.images?.[0]?.url || "";

    setIsAddingToCart(true);
    try {
      addToCart({
        productId: productDetail.id.toString(),
        productName: productDetail.name,
        productPrice: productDetail.price,
        productImage: cartImage,
        size: selectedSize,
      });
      toast.success(`${productDetail.name} added to bag!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) return <LoadingState />;
  if (error || !productDetail)
    return (
      <ErrorState
        error={error || "Product not found"}
        onRetry={() => productId && fetchProductDetail(productId)}
      />
    );

  const cartItemCount = getCartItemCount();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="flex items-center gap-2">
          <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors">
            <Share className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={() => navigate("/bag")}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors relative"
          >
            <ShoppingBag className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Product Images */}
      <div className="relative mx-4 mt-4">
        <div
          className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden relative"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Check if image exists and display it */}
          {orderedImages[currentImageIndex]?.url ? (
            <img
              src={orderedImages[currentImageIndex].url}
              alt={`${productDetail.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover rounded-2xl transition-opacity duration-300 ease-in-out"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <ProductImage type="" className="rounded-2xl" />
          )}

          {/* Swipe Hint - only show if multiple images and not manually controlled recently */}
          {orderedImages.length > 1 && !isManualControl && (
            <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              {currentImageIndex + 1}/{orderedImages.length} • Swipe
            </div>
          )}

          {/* Navigation arrows for desktop/larger screens */}
          {orderedImages.length > 1 && (
            <>
              <button
                onClick={() =>
                  handleManualImageChange(
                    currentImageIndex === 0
                      ? orderedImages.length - 1
                      : currentImageIndex - 1
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity md:opacity-70 md:hover:opacity-100"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  handleManualImageChange(
                    (currentImageIndex + 1) % orderedImages.length
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity md:opacity-70 md:hover:opacity-100"
              >
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
              </button>
            </>
          )}
        </div>

        {/* Enhanced Image indicators with progress */}
        {orderedImages && orderedImages.length > 1 && (
          <div className="mt-4">
            {/* Dot indicators */}
            <div className="flex justify-center gap-2">
              {orderedImages.map((index: number) => (
                <button
                  key={index}
                  onClick={() => handleManualImageChange(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? "bg-gray-900 dark:bg-gray-100 scale-125"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>

            {/* Image counter */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
              {currentImageIndex + 1} of {orderedImages.length}
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {productDetail.name}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          {productDetail.price} WLD
        </p>

        {/* Size Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Size
            </span>
            <SizeSelector
              sizes={productDetail.sizes?.map((s: ProductSize) => s.size) || []}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
              sizeDetails={productDetail.sizes}
            />
          </div>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-0">
          <ExpandableSectionComponent
            title="About"
            content={productDetail.description}
            isExpanded={expandedSections.has("about")}
            onToggle={() => toggleSection("about")}
          />

          {expandedSections.has("about") && (
            <div className="pb-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserRoundCheck className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Made by
                  </span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {productDetail.madeBy}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    In stock
                  </span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {productDetail.inStock}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shirt className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Collection
                  </span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {productDetail.collection.name}
                </span>
              </div>
            </div>
          )}

          <ExpandableSectionComponent
            title="Material"
            content={productDetail.material}
            isExpanded={expandedSections.has("material")}
            onToggle={() => toggleSection("material")}
          />

          <ExpandableSectionComponent
            title="Other Details"
            content={
              productDetail.otherDetails || "Additional details not available"
            }
            isExpanded={expandedSections.has("otherDetails")}
            onToggle={() => toggleSection("otherDetails")}
          />
        </div>

        {/* Add to Cart Button */}
        <div className="mt-8 mb-8">
          <button
            onClick={handleAddToCart}
            disabled={
              isAddingToCart || !selectedSize || isSelectedSizeOutOfStock()
            }
            className={`w-full py-4 rounded-full font-semibold text-lg transition-colors ${
              isAddingToCart || !selectedSize || isSelectedSizeOutOfStock()
                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            }`}
          >
            {isAddingToCart
              ? "Adding..."
              : isSelectedSizeOutOfStock() && selectedSize
              ? "Out of product"
              : "Add to bag"}
          </button>

          {/* Stock information for selected size */}
          {selectedSize && (
            <div className="mt-2 text-center text-sm">
              {(() => {
                const sizeInfo = getSelectedSizeStock();
                if (!sizeInfo) return null;

                if (sizeInfo.stockQuantity === 0 || !sizeInfo.available) {
                  return null;
                }

                return null;
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
