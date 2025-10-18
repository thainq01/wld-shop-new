import { useState, useCallback } from "react";
import { userCheckoutFormApi } from "../utils/api";
import type {
  UserCheckoutForm,
  CreateUserCheckoutFormRequest,
} from "../types";

interface UseUserCheckoutFormReturn {
  isLoading: boolean;
  error: string | null;
  savedForm: UserCheckoutForm | null;
  saveForm: (data: CreateUserCheckoutFormRequest) => Promise<UserCheckoutForm | null>;
  loadForm: (walletAddress: string) => Promise<UserCheckoutForm | null>;
  clearError: () => void;
}

export const useUserCheckoutForm = (): UseUserCheckoutFormReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedForm, setSavedForm] = useState<UserCheckoutForm | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const saveForm = useCallback(
    async (data: CreateUserCheckoutFormRequest): Promise<UserCheckoutForm | null> => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("💾 Saving user checkout form:", data);
        const response = await userCheckoutFormApi.saveForm(data);
        
        if (response) {
          setSavedForm(response);
          console.log("✅ User checkout form saved successfully:", response);
          return response;
        } else {
          throw new Error("Failed to save checkout form");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to save checkout form";
        console.error("❌ Error saving checkout form:", errorMessage);
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const loadForm = useCallback(
    async (walletAddress: string): Promise<UserCheckoutForm | null> => {
      if (!walletAddress) {
        console.log("⚠️ No wallet address provided for loading form");
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("📥 Loading user checkout form for wallet:", walletAddress);
        const response = await userCheckoutFormApi.getByWalletAddress(walletAddress);
        
        if (response) {
          setSavedForm(response);
          console.log("✅ User checkout form loaded successfully:", response);
          return response;
        } else {
          // Form not found is not an error - user hasn't saved a form yet
          console.log("📭 No saved checkout form found for wallet:", walletAddress);
          setSavedForm(null);
          return null;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load checkout form";
        console.error("❌ Error loading checkout form:", errorMessage);
        
        // If it's a 404 error, it's not really an error - just no saved form
        if (errorMessage.includes("404") || errorMessage.includes("not found")) {
          console.log("📭 No saved form found (404) - this is normal for new users");
          setSavedForm(null);
          setError(null);
          return null;
        }
        
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    error,
    savedForm,
    saveForm,
    loadForm,
    clearError,
  };
};