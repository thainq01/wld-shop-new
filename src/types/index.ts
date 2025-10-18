export type Theme = "dark" | "light";

// Updated to match API response
export interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  language: string;
  createdAt: string;
}

export interface ProductImage {
  url: string;
  altText: string;
  isPrimary: boolean;
  orderIndex?: number;
}

export interface ProductSize {
  size: string;
  price: number | null;
  stockQuantity: number;
  available: boolean;
}

export interface ProductVariant {
  size: string;
  price: number | null;
  stockQuantity: number;
  available: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  collection: {
    id: number;
    name: string;
    slug: string;
  } | null;
  category: string;
  material: string;
  madeBy: string;
  inStock: string;
  featured: boolean;
  active: boolean;
  language: string;
  images: ProductImage[] | null;
  sizes: ProductSize[] | null;
  otherDetails: string;
  createdAt: string;
  updatedAt?: string;
  // New country-specific pricing fields
  basePrice: number;
  countryPrice: number | null;
  countryCode: string;
  hasCountrySpecificPrice: boolean;
  currency: string;
  effectivePrice: number;
}

export interface CreateCollectionRequest {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  language?: string; // Optional, defaults to "en" on backend
}

export interface UpdateCollectionRequest {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  language?: string; // Optional, preserves existing if not provided
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  collectionId: number;
  category: string;
  material: string;
  madeBy: string;
  inStock: string;
  featured: boolean;
  language?: string; // Optional, defaults to "en" on backend
  otherDetails: string;
  productVariants: ProductVariant[];
  productImages: ProductImage[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  collectionId?: number;
  category?: string;
  material?: string;
  madeBy?: string;
  inStock?: string;
  featured?: boolean;
  language?: string; // Optional, preserves existing if not provided
  otherDetails?: string;
  productVariants?: ProductVariant[];
  productImages?: ProductImage[];
}

// Multi-language collection types
export interface CollectionTranslation {
  languageCode: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface MultiLanguageCollection {
  id: number;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  translations: Record<string, CollectionTranslation>;
  availableLanguages: string[];
  defaultLanguage: string;
  metadata: {
    requestedLanguage: string;
    requestedCountry: string | null;
    effectiveLanguage: string;
    effectiveCountry: string | null;
    currency: string;
    hasLanguageFallback: boolean;
    hasCountryFallback: boolean;
    responseTimestamp: string;
  };
}

export interface CreateMultiLanguageCollectionRequest {
  slug: string;
  isActive: boolean;
  translations: Record<
    string,
    {
      name: string;
      description: string;
    }
  >;
}

export interface UpdateMultiLanguageCollectionRequest {
  slug?: string;
  isActive?: boolean;
  translations?: Record<
    string,
    {
      name: string;
      description: string;
    }
  >;
}

// Multi-language product types
export interface ProductTranslation {
  languageCode: string;
  name: string;
  description: string;
  material: string;
  otherDetails: string;
  createdAt: string;
  updatedAt: string;
}

export interface MultiLanguageProduct {
  id: number;
  basePrice: number;
  discountPrice?: number;
  collection: {
    id: number;
    name: string;
    slug: string;
  } | null;
  category: string;
  madeBy: string;
  inStock: string;
  featured: boolean;
  active: boolean;
  sizes: ProductSize[];
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
  translations: Record<string, ProductTranslation>;
  availableLanguages: string[];
  defaultLanguage: string;
  countryPrices: Record<string, number>;
  availableCountries: string[];
  metadata: {
    requestedLanguage: string;
    requestedCountry: string | null;
    effectiveLanguage: string;
    effectiveCountry: string | null;
    currency: string;
    hasLanguageFallback: boolean;
    hasCountryFallback: boolean;
    responseTimestamp: string;
  };
}

export interface CreateMultiLanguageProductRequest {
  price: number;
  discountPrice?: number;
  collectionId?: number;
  category: string;
  madeBy: string;
  inStock: string;
  featured: boolean;
  active: boolean;
  translations: Record<
    string,
    {
      name: string;
      description: string;
      material: string;
      otherDetails: string;
    }
  >;
  countryPrices?: Record<string, number>;
  productVariants: ProductVariant[];
  productImages: ProductImage[];
}

export interface UpdateMultiLanguageProductRequest {
  price?: number;
  discountPrice?: number;
  collectionId?: number;
  category?: string;
  madeBy?: string;
  inStock?: string;
  featured?: boolean;
  active?: boolean;
  translations?: Record<
    string,
    {
      name: string;
      description: string;
      material: string;
      otherDetails: string;
    }
  >;
  countryPrices?: Record<string, number>;
  productVariants?: ProductVariant[];
  productImages?: ProductImage[];
}

// Cart API Types
export interface CartItem {
  id: number;
  walletAddress: string;
  productId: string;
  productName: string;
  productPrice: number;
  basePrice: number;
  discountPrice?: number;
  productImage: string;
  collectionSlug: string;
  size: string;
  quantity: number;
  languageCode: string;
  currency: string;
  lineTotal: number;
  isProductActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  walletAddress: string;
  items: CartItem[];
  totalItems: number;
  totalQuantity: number;
  totalAmount: number;
  currency: string;
  languageCode: string;
}

export interface AddToCartRequest {
  productId: string;
  size: string;
  quantity: number;
  language: string;
  country: string;
}

export interface UpdateCartItemRequest {
  quantity?: number;
  size?: string;
  country?: string;
}

// User Management Types
export interface User {
  id: number;
  walletAddress: string;
  username: string;
  profilePictureUrl: string | null;
  userMetadata?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  walletAddress: string;
  username: string;
  profilePictureUrl?: string | null;
  userMetadata?: string | null;
}

export interface UpdateUserRequest {
  username?: string;
  profilePictureUrl?: string | null;
  userMetadata?: string | null;
}

// IPInfo.io API Response Types
export interface IPInfoResponse {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  postal?: string;
  timezone?: string;
  readme?: string;
}

export interface UserApiResponse<T> {
  success: boolean;
  data: T;
  statusCode: number;
  message?: string;
  validation?: Record<string, string>;
}

// Checkout Types
export interface CheckoutProduct {
  productId: number;
  size: string;
  quantity: number;
}

export interface CreateCheckoutRequest {
  orderId?: string; // Optional - will be auto-generated if not provided
  walletAddress: string;
  email: string;
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  postcode: string;
  phone: string;
  language?: string; // Optional - user's language preference
  totalAmount?: string; // Optional - total amount with country-specific pricing
  status?: string; // Optional - defaults to "pending"
  transactionHash?: string; // Optional - transaction hash from WLD payment
  products: CheckoutProduct[];
}

export interface CheckoutProductResponse {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface Checkout {
  id: number;
  orderId?: string;
  status?: string; // "pending", "paid", "out for delivery", "delivered"
  walletAddress: string;
  email: string;
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  postcode: string;
  phone: string;
  language?: string; // User's language preference
  totalAmount?: string; // Total amount with country-specific pricing
  transactionHash?: string; // Transaction hash from WLD payment
  carrier?: string | null; // Shipping carrier name (e.g., "FedEx", "UPS")
  trackingCode?: string | null; // Shipping tracking number
  createdAt: string;
  updatedAt: string;
  products?: CheckoutProductResponse[];
}

export interface CheckoutResponse {
  success: boolean;
  data: Checkout;
  message?: string;
}

export interface CheckoutListResponse {
  success: boolean;
  data: {
    content: Checkout[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  message?: string;
}

// Order Success Types
export interface OrderSuccessProduct {
  id: number;
  checkoutId: number;
  product: Product;
  quantity: number;
  priceAtPurchase: number;
  lineTotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderSuccessData {
  id: number;
  orderId: string;
  walletAddress: string;
  email: string;
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  postcode: string;
  phone: string;
  language?: string; // User's language preference
  totalAmount: string;
  status: string; // "pending", "paid", "out for delivery", "delivered"
  transactionHash?: string; // Transaction hash from WLD payment
  products: OrderSuccessProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderSuccessResponse {
  success: boolean;
  data: OrderSuccessData;
  statusCode: number;
}
