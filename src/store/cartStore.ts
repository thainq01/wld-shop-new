import { create } from "zustand";
import { cartApi } from "../utils/api";
import type { CartItem, AddToCartRequest } from "../types";
import { useLanguageStore } from "./languageStore";
import { useCountryStore } from "./countryStore";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  totalItems: number;
  totalQuantity: number;
  totalAmount: number;

  // Actions
  fetchCart: (walletAddress: string) => Promise<void>;
  addToCart: (
    walletAddress: string,
    item: Omit<AddToCartRequest, "quantity" | "language" | "country">
  ) => Promise<void>;
  removeFromCart: (walletAddress: string, itemId: number) => Promise<void>;
  updateQuantity: (
    walletAddress: string,
    itemId: number,
    quantity: number
  ) => Promise<void>;
  updateSize: (
    walletAddress: string,
    itemId: number,
    size: string
  ) => Promise<void>;
  clearCart: () => void;
  toggleCart: () => void;
  setError: (error: string | null) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  isLoading: false,
  error: null,
  totalItems: 0,
  totalQuantity: 0,
  totalAmount: 0,

  fetchCart: async (walletAddress: string) => {
    if (!walletAddress) return;

    console.log("Fetching cart for wallet:", walletAddress);
    set({ isLoading: true, error: null });
    try {
      // For cart, use UI language for both lang and country
      const currentLanguage = useLanguageStore.getState().currentLanguage;
      const cartData = await cartApi.getCart(
        walletAddress,
        currentLanguage,
        currentLanguage
      );
      console.log("Cart data fetched:", cartData);
      console.log("Cart items count:", cartData.items?.length || 0);
      console.log("Cart items:", cartData.items);
      console.log("Using language and country:", currentLanguage);

      set({
        items: cartData.items || [],
        totalItems: cartData.totalItems || 0,
        totalQuantity: cartData.totalQuantity || 0,
        totalAmount: cartData.totalAmount || 0,
        isLoading: false,
      });
      console.log("Cart state updated from fetch");
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch cart",
        isLoading: false,
      });
    }
  },

  addToCart: async (walletAddress: string, newItem) => {
    if (!walletAddress) return;

    // For add to cart, we'll wait for the API response since we need the item ID
    // But we can show a loading state without clearing the cart
    set({ isLoading: true, error: null });

    try {
      console.log("Adding item to cart:", newItem);
      // For cart, use UI language for both lang and country
      const currentLanguage = useLanguageStore.getState().currentLanguage;
      const cartData = await cartApi.addToCart(walletAddress, {
        ...newItem,
        quantity: 1,
        language: currentLanguage,
        country: currentLanguage,
      });
      console.log("Cart data received from add:", cartData);

      if (cartData && cartData.items) {
        set({
          items: cartData.items || [],
          totalItems: cartData.totalItems || 0,
          totalQuantity: cartData.totalQuantity || 0,
          totalAmount: cartData.totalAmount || 0,
          isLoading: false,
        });
      } else {
        // If response is invalid, refetch the cart
        console.warn("Invalid cart data received from add, refetching cart...");
        const currentLanguage = useLanguageStore.getState().currentLanguage;
        const refreshedCartData = await cartApi.getCart(
          walletAddress,
          currentLanguage,
          currentLanguage
        );
        set({
          items: refreshedCartData.items || [],
          totalItems: refreshedCartData.totalItems || 0,
          totalQuantity: refreshedCartData.totalQuantity || 0,
          totalAmount: refreshedCartData.totalAmount || 0,
          isLoading: false,
        });
      }
      console.log("Cart state updated after add");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to add to cart",
        isLoading: false,
      });
      throw error;
    }
  },

  removeFromCart: async (walletAddress: string, itemId: number) => {
    if (!walletAddress) return;

    // Optimistically update the cart state first
    const currentState = get();
    const currentItems = currentState.items.filter(
      (item) => item.id !== itemId
    );
    const newTotalItems = currentItems.length;
    const newTotalQuantity = currentItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    // Compute new total amount using lineTotal when available; fall back to effective price * qty
    const newTotalAmount = currentItems.reduce((sum, item) => {
      const effective =
        (item.discountPrice && item.discountPrice > 0
          ? item.discountPrice
          : item.productPrice) ?? 0;
      const line = item.lineTotal ?? effective * item.quantity;
      return sum + line;
    }, 0);

    // Update state immediately for smooth UX
    set({
      items: currentItems,
      totalItems: newTotalItems,
      totalQuantity: newTotalQuantity,
      totalAmount: newTotalAmount,
      isLoading: false,
    });

    // Then make the API call in the background
    try {
      console.log("Removing item", itemId, "from cart");
      await cartApi.removeCartItem(walletAddress, itemId);
      console.log("Item removed successfully from API");
      console.log("Cart state updated after removal");
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      // Revert optimistic update on error
      set({
        error:
          error instanceof Error ? error.message : "Failed to remove from cart",
        isLoading: false,
      });
      // Refetch cart to ensure consistency
      get().fetchCart(walletAddress);
      // Re-throw error so component can handle it (e.g., show toast)
      throw error;
    }
  },

  updateQuantity: async (
    walletAddress: string,
    itemId: number,
    quantity: number
  ) => {
    if (!walletAddress) return;

    if (quantity <= 0) {
      // If quantity is 0 or negative, remove the item
      await get().removeFromCart(walletAddress, itemId);
      return;
    }

    // Optimistically update the cart state first
    const currentState = get();
    const currentItems = [...currentState.items];
    const itemIndex = currentItems.findIndex((item) => item.id === itemId);

    let newTotalQuantity = 0;
    let newTotalAmount = 0;

    if (itemIndex !== -1) {
      // Update the item optimistically
      const orig = currentItems[itemIndex];
      const effective =
        (orig.discountPrice && orig.discountPrice > 0
          ? orig.discountPrice
          : orig.productPrice) ?? 0;
      currentItems[itemIndex] = {
        ...orig,
        quantity: quantity,
        lineTotal: effective * quantity,
      };

      // Calculate new totals
      const newTotalItems = currentItems.length;
      newTotalQuantity = currentItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      newTotalAmount = currentItems.reduce((sum, item) => {
        const effective =
          (item.discountPrice && item.discountPrice > 0
            ? item.discountPrice
            : item.productPrice) ?? 0;
        const line = item.lineTotal ?? effective * item.quantity;
        return sum + line;
      }, 0);

      // Update state immediately for smooth UX
      set({
        items: currentItems,
        totalItems: newTotalItems,
        totalQuantity: newTotalQuantity,
        totalAmount: newTotalAmount,
        isLoading: false,
      });
    }

    // Then make the API call in the background
    try {
      console.log("Updating quantity for item", itemId, "to", quantity);
      // Get selected country
      const selectedCountry = useCountryStore.getState().selectedCountry;
      const cartData = await cartApi.updateCartItem(walletAddress, itemId, {
        quantity,
        country: selectedCountry,
      });
      console.log("Cart data received from update:", cartData);

      // Only update state if the API response is valid and different from our optimistic update
      if (cartData && cartData.items) {
        const serverTotalQuantity = cartData.totalQuantity || 0;
        const serverTotalAmount = cartData.totalAmount || 0;

        // Only update if the server data is significantly different (to avoid unnecessary re-renders)
        if (
          Math.abs(serverTotalQuantity - newTotalQuantity) > 0.01 ||
          Math.abs(serverTotalAmount - newTotalAmount) > 0.01
        ) {
          set({
            items: cartData.items || [],
            totalItems: cartData.totalItems || 0,
            totalQuantity: cartData.totalQuantity || 0,
            totalAmount: cartData.totalAmount || 0,
            isLoading: false,
          });
        }
      }
      console.log("Cart state updated successfully");
    } catch (error) {
      console.error("Failed to update quantity:", error);
      // Revert optimistic update on error
      set({
        error:
          error instanceof Error ? error.message : "Failed to update quantity",
        isLoading: false,
      });
      // Refetch cart to ensure consistency
      get().fetchCart(walletAddress);
      // Re-throw error so component can handle it (e.g., show toast)
      throw error;
    }
  },

  updateSize: async (walletAddress: string, itemId: number, size: string) => {
    if (!walletAddress) return;

    set({ isLoading: true, error: null });
    try {
      console.log("Updating size for item", itemId, "to", size);
      // Get selected country
      const selectedCountry = useCountryStore.getState().selectedCountry;
      const cartData = await cartApi.updateCartItem(walletAddress, itemId, {
        size,
        country: selectedCountry,
      });
      console.log("Cart data received from size update:", cartData);

      // Check if the response has the expected structure
      if (!cartData || !cartData.items) {
        console.warn(
          "Invalid cart data received from size update, refetching cart..."
        );
        // If the response doesn't have the expected structure, refetch the cart
        const currentLanguage = useLanguageStore.getState().currentLanguage;
        const refreshedCartData = await cartApi.getCart(
          walletAddress,
          currentLanguage,
          currentLanguage
        );
        console.log(
          "Refreshed cart data after size update:",
          refreshedCartData
        );

        set({
          items: refreshedCartData.items || [],
          totalItems: refreshedCartData.totalItems || 0,
          totalQuantity: refreshedCartData.totalQuantity || 0,
          totalAmount: refreshedCartData.totalAmount || 0,
          isLoading: false,
        });
      } else {
        set({
          items: cartData.items || [],
          totalItems: cartData.totalItems || 0,
          totalQuantity: cartData.totalQuantity || 0,
          totalAmount: cartData.totalAmount || 0,
          isLoading: false,
        });
      }
      console.log("Cart state updated after size update");
    } catch (error) {
      console.error("Failed to update size:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to update size",
        isLoading: false,
      });
    }
  },

  clearCart: () => {
    set({
      items: [],
      totalItems: 0,
      totalQuantity: 0,
      totalAmount: 0,
      error: null,
    });
  },

  toggleCart: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));

// Subscribe to language changes and refresh cart when language changes
let previousLanguageForCart = useLanguageStore.getState().currentLanguage;

useLanguageStore.subscribe(() => {
  const currentLanguage = useLanguageStore.getState().currentLanguage;
  // Only refresh if language actually changed
  if (currentLanguage !== previousLanguageForCart) {
    console.log(
      `UI language changed from ${previousLanguageForCart} to ${currentLanguage}, refreshing cart...`
    );
    previousLanguageForCart = currentLanguage;

    // Note: We can't directly access wallet address here, so we'll rely on the component to handle this
    // The useCart hook will handle the language change and refetch the cart
  }
});

// Note: Cart now only depends on UI language, not on selected country
// Country changes will only affect checkout pricing, not cart content
