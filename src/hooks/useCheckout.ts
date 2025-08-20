import { useState } from "react";
import { checkoutApi } from "../utils/api";
import type { 
  CreateCheckoutRequest, 
  Checkout, 
  CheckoutProductResponse 
} from "../types";

interface UseCheckoutReturn {
  // State
  isLoading: boolean;
  error: string | null;
  checkout: Checkout | null;
  checkouts: Checkout[];
  checkoutProducts: CheckoutProductResponse[];

  // Actions
  createCheckout: (data: CreateCheckoutRequest) => Promise<Checkout | null>;
  getCheckout: (id: number) => Promise<Checkout | null>;
  getAllCheckouts: (params?: { page?: number; size?: number }) => Promise<void>;
  getCheckoutProducts: (id: number) => Promise<CheckoutProductResponse[] | null>;
  clearError: () => void;
  clearCheckout: () => void;
}

export function useCheckout(): UseCheckoutReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [checkoutProducts, setCheckoutProducts] = useState<CheckoutProductResponse[]>([]);

  const createCheckout = async (data: CreateCheckoutRequest): Promise<Checkout | null> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Creating checkout with data:", data);
      const result = await checkoutApi.create(data);
      setCheckout(result);
      console.log("Checkout created successfully:", result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create checkout";
      console.error("Checkout creation failed:", err);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getCheckout = async (id: number): Promise<Checkout | null> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching checkout with ID:", id);
      const result = await checkoutApi.getById(id);
      setCheckout(result);
      console.log("Checkout fetched successfully:", result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch checkout";
      console.error("Checkout fetch failed:", err);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllCheckouts = async (params?: { page?: number; size?: number }): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching all checkouts with params:", params);
      const result = await checkoutApi.getAll(params);
      setCheckouts(result.content);
      console.log("Checkouts fetched successfully:", result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch checkouts";
      console.error("Checkouts fetch failed:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getCheckoutProducts = async (id: number): Promise<CheckoutProductResponse[] | null> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching products for checkout ID:", id);
      const result = await checkoutApi.getProducts(id);
      setCheckoutProducts(result);
      console.log("Checkout products fetched successfully:", result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch checkout products";
      console.error("Checkout products fetch failed:", err);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const clearCheckout = () => {
    setCheckout(null);
    setCheckouts([]);
    setCheckoutProducts([]);
    setError(null);
  };

  return {
    // State
    isLoading,
    error,
    checkout,
    checkouts,
    checkoutProducts,

    // Actions
    createCheckout,
    getCheckout,
    getAllCheckouts,
    getCheckoutProducts,
    clearError,
    clearCheckout,
  };
}
