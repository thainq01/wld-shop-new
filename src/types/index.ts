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
  price: number;
  stockQuantity: number;
  available: boolean;
}

export interface ProductVariant {
  size: string;
  price: number;
  stockQuantity: number;
  available: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  collection: {
    id: number;
    name: string;
    slug: string;
  };
  category: string;
  material: string;
  madeBy: string;
  inStock: string;
  featured: boolean;
  language: string;
  images: ProductImage[] | null;
  sizes: ProductSize[] | null;
  otherDetails: string;
  createdAt: string;
  updatedAt: string;
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

// Cart API Types
export interface CartItem {
  id: number;
  walletAddress: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  size: string;
  quantity: number;
  lineTotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  walletAddress: string;
  items: CartItem[];
  totalItems: number;
  totalQuantity: number;
  totalAmount: number;
}

export interface AddToCartRequest {
  productId: string;
  size: string;
  quantity: number;
  language: string;
}

export interface UpdateCartItemRequest {
  quantity?: number;
  size?: string;
}

// User Management Types
export interface User {
  id: number;
  walletAddress: string;
  username: string;
  profilePictureUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  walletAddress: string;
  username: string;
  profilePictureUrl?: string | null;
}

export interface UpdateUserRequest {
  username?: string;
  profilePictureUrl?: string | null;
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
  totalAmount: number;
  status: string; // "pending", "paid", "out for delivery", "delivered"
  products: OrderSuccessProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderSuccessResponse {
  success: boolean;
  data: OrderSuccessData;
  statusCode: number;
}
