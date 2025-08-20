export type Theme = "dark" | "light";

// Updated to match API response
export interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
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
}

export interface UpdateCollectionRequest {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
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
  otherDetails?: string;
  productVariants?: ProductVariant[];
  productImages?: ProductImage[];
}

export interface CartItem {
  product: Product;
  quantity: number;
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
