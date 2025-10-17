import { useState } from "react";
import { updateUserMetadata } from "../utils/ipInfo";

interface UseUserMetadataReturn {
  isUpdating: boolean;
  error: string | null;
  updateMetadata: (walletAddress: string) => Promise<boolean>;
  clearError: () => void;
}

export function useUserMetadata(): UseUserMetadataReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMetadata = async (walletAddress: string): Promise<boolean> => {
    if (!walletAddress) {
      setError("Wallet address is required");
      return false;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const success = await updateUserMetadata(walletAddress);

      if (!success) {
        setError("Failed to update user metadata");
        return false;
      }

      console.log("✅ Metadata updated successfully for:", walletAddress);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("❌ Error updating metadata:", errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isUpdating,
    error,
    updateMetadata,
    clearError,
  };
}
