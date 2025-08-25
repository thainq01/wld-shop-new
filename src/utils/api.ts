const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

import type {
  Collection,
  Product,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  CreateProductRequest,
  UpdateProductRequest,
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserApiResponse,
  CreateCheckoutRequest,
  Checkout,
  CheckoutResponse,
  CheckoutListResponse,
  CheckoutProductResponse,
  OrderSuccessResponse,
  CartResponse,
  AddToCartRequest,
  UpdateCartItemRequest,
} from "../types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// API Error interface
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
  };
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<T> | ApiError = await response.json();

    if (!result.success) {
      const error = result as ApiError;
      throw new Error(error.error.message || "API request failed");
    }

    return (result as ApiResponse<T>).data;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error instanceof Error ? error : new Error("Unknown API error");
  }
}

// Special fetch function for delete operations
async function apiDelete(endpoint: string): Promise<DeleteResponse> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response has content
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const result: DeleteResponse = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Delete operation failed");
      }
      return result;
    } else {
      // If no JSON response, assume success for 2xx status codes
      return {
        success: true,
        message: "Item deleted successfully",
      };
    }
  } catch (error) {
    console.error(`Delete API Error for ${endpoint}:`, error);
    throw error instanceof Error ? error : new Error("Unknown delete error");
  }
}

export const collectionsApi = {
  getAll: (params?: { lang?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.lang) searchParams.append("lang", params.lang);
    
    const query = searchParams.toString();
    return apiFetch<Collection[]>(`/api/collections${query ? `?${query}` : ""}`);
  },

  getProducts: (slug: string, params?: { lang?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.lang) searchParams.append("lang", params.lang);
    
    const query = searchParams.toString();
    return apiFetch<Product[]>(`/api/collections/${slug}/products${query ? `?${query}` : ""}`);
  },

  // CMS operations
  create: (data: CreateCollectionRequest) =>
    apiFetch<Collection>("/api/collections", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdateCollectionRequest) =>
    apiFetch<Collection>(`/api/collections/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) => apiDelete(`/api/collections/${id}`),
};

export const productsApi = {
  getAll: (params?: { collection?: string; limit?: number; page?: number; lang?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.collection)
      searchParams.append("collection", params.collection);
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.lang) searchParams.append("lang", params.lang);

    const query = searchParams.toString();
    return apiFetch<Product[]>(`/api/products${query ? `?${query}` : ""}`);
  },

  getById: (id: string | number, params?: { lang?: string }) => {
    const searchParams = new URLSearchParams();
    searchParams.append("id", id.toString());
    if (params?.lang) searchParams.append("lang", params.lang);
    
    const query = searchParams.toString();
    return apiFetch<Product>(`/api/products?${query}`);
  },

  // CMS operations
  create: (data: CreateProductRequest) =>
    apiFetch<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdateProductRequest) =>
    apiFetch<Product>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) => apiDelete(`/api/products/${id}`),
};

async function userApiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: UserApiResponse<T> = await response.json();

    if (!result.success) {
      const errorMessage = result.message || "API request failed";
      if (result.validation) {
        const validationErrors = Object.entries(result.validation)
          .map(([field, error]) => `${field}: ${error}`)
          .join(", ");
        throw new Error(
          `${errorMessage}. Validation errors: ${validationErrors}`
        );
      }
      throw new Error(errorMessage);
    }

    return result.data;
  } catch (error) {
    console.error(`User API Error for ${endpoint}:`, error);
    throw error instanceof Error ? error : new Error("Unknown API error");
  }
}

export const usersApi = {
  getAll: () => userApiFetch<User[]>("/api/users"),

  getById: (id: number) => userApiFetch<User>(`/api/users/${id}`),

  getByWalletAddress: (walletAddress: string) =>
    userApiFetch<User>(
      `/api/users?walletAddress=${encodeURIComponent(walletAddress)}`
    ),

  create: (data: CreateUserRequest) =>
    userApiFetch<User>("/api/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdateUserRequest) =>
    userApiFetch<User>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  partialUpdate: (id: number, data: UpdateUserRequest) =>
    userApiFetch<User>(`/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: number) => apiDelete(`/api/users/${id}`),

  createOrUpdate: async (userData: CreateUserRequest): Promise<User> => {
    console.log("🔄 createOrUpdate called with:", userData);

    try {
      // Try to get existing user by wallet address
      console.log(
        "🔍 Checking for existing user with wallet:",
        userData.walletAddress
      );
      const existingUser = await usersApi.getByWalletAddress(
        userData.walletAddress
      );

      console.log("✅ Found existing user:", existingUser);
      console.log(
        "User ID:",
        existingUser?.id,
        "Type:",
        typeof existingUser?.id
      );

      // Check if user has valid ID
      if (!existingUser?.id) {
        console.error(
          "❌ User found but missing valid ID, creating new user instead"
        );
        throw new Error("User missing ID");
      }

      const updateData: UpdateUserRequest = {
        username: userData.username,
        profilePictureUrl: userData.profilePictureUrl,
      };

      console.log(
        `🔄 Updating existing user ID ${existingUser.id} with:`,
        updateData
      );
      const updatedUser = await usersApi.partialUpdate(
        existingUser.id,
        updateData
      );
      console.log("✅ User updated successfully:", updatedUser);
      return updatedUser;
    } catch (error) {
      console.log(
        "👤 User not found or invalid, creating new user. Error:",
        error
      );

      try {
        console.log("🆕 Creating new user with data:", userData);
        const newUser = await usersApi.create(userData);
        console.log("✅ New user created successfully:", newUser);
        return newUser;
      } catch (createError) {
        console.error("❌ Failed to create new user:", createError);
        throw createError;
      }
    }
  },
};

// Checkout API functions
export const checkoutApi = {
  // Create a new checkout
  create: (data: CreateCheckoutRequest) =>
    apiFetch<OrderSuccessResponse>("/api/checkout", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get a specific checkout with products
  getById: (id: number) => apiFetch<Checkout>(`/api/checkout/${id}`),

  // Get all checkouts with pagination
  getAll: (params?: { page?: number; size?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined)
      searchParams.append("page", params.page.toString());
    if (params?.size !== undefined)
      searchParams.append("size", params.size.toString());

    const query = searchParams.toString();
    return apiFetch<CheckoutListResponse["data"]>(
      `/api/checkout${query ? `?${query}` : ""}`
    );
  },

  // Get products for a specific checkout
  getProducts: (id: number) =>
    apiFetch<CheckoutProductResponse[]>(`/api/checkout/${id}/products`),

  // Update checkout status
  updateStatus: (orderId: string, status: string) =>
    apiFetch<{ success: boolean; message: string }>(
      `/api/checkout/order/${orderId}/status?status=${status}`,
      {
        method: "PATCH",
      }
    ),
};

// Cart API functions
export const cartApi = {
          // Get all cart items for a specific wallet
        getCart: (walletAddress: string, language?: string) => {
          const url = language 
            ? `/api/cart/${walletAddress}?lang=${language}`
            : `/api/cart/${walletAddress}`;
          return apiFetch<CartResponse>(url);
        },

        // Add a product to cart
        addToCart: (walletAddress: string, data: AddToCartRequest) =>
          apiFetch<CartResponse>(`/api/cart/${walletAddress}`, {
            method: "POST",
            body: JSON.stringify(data),
          }),

  // Update a cart item
  updateCartItem: (walletAddress: string, itemId: number, data: UpdateCartItemRequest) =>
    apiFetch<CartResponse>(`/api/cart/${walletAddress}/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Remove a specific item from cart
  removeCartItem: (walletAddress: string, itemId: number) =>
    apiDelete(`/api/cart/${walletAddress}/items/${itemId}`),
};
