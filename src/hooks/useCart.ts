import { useEffect, useRef } from "react";
import { useCartStore } from "../store/cartStore";
import { useAuthWorld } from "../store/authStore";
import { useLanguageStore } from "../store/languageStore";

export const useCart = () => {
  const { address } = useAuthWorld();
  const { currentLanguage, getProductLanguage } = useLanguageStore();
  const {
    items,
    totalItems,
    totalQuantity,
    totalAmount,
    isLoading,
    error,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateSize,
    clearCart,
    toggleCart,
    isOpen,
    setError,
  } = useCartStore();

  const lastAddressRef = useRef<string | null>(null);
  const lastLanguageRef = useRef<string | null>(null);

  // Automatically fetch cart when wallet address or language changes
  useEffect(() => {
    const productLanguage = getProductLanguage();
    if (
      address &&
      (address !== lastAddressRef.current ||
        productLanguage !== lastLanguageRef.current)
    ) {
      console.log(
        "Wallet address or language changed, fetching cart for:",
        address,
        "language:",
        productLanguage
      );
      lastAddressRef.current = address;
      lastLanguageRef.current = productLanguage;
      fetchCart(address);
    }
  }, [address, currentLanguage, fetchCart, getProductLanguage]);

  return {
    items,
    totalItems,
    totalQuantity,
    totalAmount,
    isLoading,
    error,
    isOpen,
    addToCart: (item: { productId: string; size: string }) =>
      address
        ? addToCart(address, item)
        : Promise.reject(new Error("Wallet not connected")),
    removeFromCart: (itemId: number) =>
      address
        ? removeFromCart(address, itemId)
        : Promise.reject(new Error("Wallet not connected")),
    updateQuantity: (itemId: number, quantity: number) =>
      address
        ? updateQuantity(address, itemId, quantity)
        : Promise.reject(new Error("Wallet not connected")),
    updateSize: (itemId: number, size: string) =>
      address
        ? updateSize(address, itemId, size)
        : Promise.reject(new Error("Wallet not connected")),
    refreshCart: () =>
      address
        ? fetchCart(address)
        : Promise.reject(new Error("Wallet not connected")),
    clearCart,
    toggleCart,
    setError,
    hasWallet: !!address,
  };
};
