import { create } from "zustand";
import { cartApi } from "../utils/api";
import type { CartItem, AddToCartRequest } from "../types";
import { useLanguageStore } from "./languageStore";

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
    item: Omit<AddToCartRequest, "quantity" | "language">
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
      // Get current language from language store
      const productLanguage = useLanguageStore.getState().getProductLanguage();
      const cartData = await cartApi.getCart(walletAddress, productLanguage);
      console.log("Cart data fetched:", cartData);
      console.log("Cart items count:", cartData.items?.length || 0);
      console.log("Cart items:", cartData.items);

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
      // Get current language from language store
      const productLanguage = useLanguageStore.getState().getProductLanguage();
      const cartData = await cartApi.addToCart(walletAddress, {
        ...newItem,
        quantity: 1,
        language: productLanguage,
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
        const productLanguage = useLanguageStore
          .getState()
          .getProductLanguage();
        const refreshedCartData = await cartApi.getCart(
          walletAddress,
          productLanguage
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
    const newTotalAmount = currentItems.reduce(
      (sum, item) => sum + item.lineTotal,
      0
    );

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
      currentItems[itemIndex] = {
        ...currentItems[itemIndex],
        quantity: quantity,
        lineTotal: currentItems[itemIndex].productPrice * quantity,
      };

      // Calculate new totals
      const newTotalItems = currentItems.length;
      newTotalQuantity = currentItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      newTotalAmount = currentItems.reduce(
        (sum, item) => sum + item.lineTotal,
        0
      );

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
      const cartData = await cartApi.updateCartItem(walletAddress, itemId, {
        quantity,
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
      const cartData = await cartApi.updateCartItem(walletAddress, itemId, {
        size,
      });
      console.log("Cart data received from size update:", cartData);

      // Check if the response has the expected structure
      if (!cartData || !cartData.items) {
        console.warn(
          "Invalid cart data received from size update, refetching cart..."
        );
        // If the response doesn't have the expected structure, refetch the cart
        const productLanguage = useLanguageStore
          .getState()
          .getProductLanguage();
        const refreshedCartData = await cartApi.getCart(
          walletAddress,
          productLanguage
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
let previousLanguageForCart = useLanguageStore.getState().getProductLanguage();

useLanguageStore.subscribe(() => {
  const productLanguage = useLanguageStore.getState().getProductLanguage();
  // Only refresh if language actually changed
  if (productLanguage !== previousLanguageForCart) {
    console.log(
      `Product language changed from ${previousLanguageForCart} to ${productLanguage}, refreshing cart...`
    );
    previousLanguageForCart = productLanguage;

    // Note: We can't directly access wallet address here, so we'll rely on the component to handle this
    // The useCart hook will handle the language change and refetch the cart
  }
});
