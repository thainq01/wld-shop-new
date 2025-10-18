import { Product } from "../types";

/**
 * Utility function to get the effective price (for calculations)
 * Returns the discount price if available and valid, otherwise the regular price
 */
export const getEffectivePrice = (
  price: number,
  discountPrice?: number
): number => {
  return discountPrice && discountPrice > 0 && discountPrice !== price
    ? discountPrice
    : price;
};

/**
 * Utility function to extract the correct price from product object
 * Follows the same priority as the existing code: effectivePrice > countryPrice > basePrice > price
 */
export const getProductPrice = (product: Product): number => {
  return (
    product.effectivePrice ||
    product.countryPrice ||
    product.basePrice ||
    product.price ||
    0
  );
};

/**
 * Utility function to get the base/original price for display purposes
 * Returns the price that should be shown as the "original" price before discount
 */
export const getBasePrice = (product: Product): number => {
  return (
    product.basePrice ||
    product.price ||
    product.countryPrice ||
    product.effectivePrice ||
    0
  );
};

/**
 * Check if a product has a valid discount
 */
export const hasValidDiscount = (
  price: number,
  discountPrice?: number
): boolean => {
  return !!(discountPrice && discountPrice > 0 && discountPrice !== price);
};
