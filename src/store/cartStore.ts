import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  size: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addToCart: (newItem) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (item) =>
            item.productId === newItem.productId && item.size === newItem.size
        );

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += 1;
          set({ items: updatedItems });
        } else {
          // Add new item
          set({ items: [...items, { ...newItem, quantity: 1 }] });
        }
      },

      removeFromCart: (productId, size) => {
        const { items } = get();
        set({
          items: items.filter(
            (item) => !(item.productId === productId && item.size === size)
          ),
        });
      },

      updateQuantity: (productId, size, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          get().removeFromCart(productId, size);
          return;
        }

        const updatedItems = items.map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity }
            : item
        );
        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      getCartTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.productPrice * item.quantity,
          0
        );
      },

      getCartItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
