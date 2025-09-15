import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  transferByTokenExact,
  waitForTransactionReceipt,
  getErrorMessage,
  PaymentParams
} from '../utils/payment-service';

export interface UseWLDPaymentResult {
  isLoading: boolean;
  transferByTokenExact: (params: PaymentParams) => Promise<{ success: boolean; txHash?: string; error?: string }>;
}

export function useWLDPayment(): UseWLDPaymentResult {
  const [isLoading, setIsLoading] = useState(false);

  const transferByTokenExactHook = useCallback(async (params: PaymentParams) => {
    try {
      setIsLoading(true);

      console.log("🔄 Starting Transfer By Token Exact (wld-prediction-client pattern)...");
      const response = await transferByTokenExact(params);

      if (response.finalPayload?.status === "error") {
        const errorMsg = getErrorMessage(response.finalPayload.error_code);
        throw new Error(errorMsg);
      }

      if (!response.finalPayload?.transaction_id) {
        throw new Error("No transaction ID received");
      }

      console.log("⏳ Waiting for transaction confirmation...");
      const txHash = await waitForTransactionReceipt(response.finalPayload.transaction_id);

      toast.success("Transfer by token exact successful! (wld-prediction-client pattern)");
      console.log("✅ Transfer by token exact successful:", txHash);

      return {
        success: true,
        txHash: txHash,
      };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Transfer by token exact failed. Please try again.";
      toast.error(errorMessage);
      console.error("❌ Transfer by token exact failed:", error);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    transferByTokenExact: transferByTokenExactHook,
  };
}

// Hook for payment status tracking (similar to wld-prediction-client pattern)
export function usePaymentStatus() {
  const [status, setStatus] = useState<'idle' | 'approving' | 'paying' | 'completed' | 'failed'>('idle');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [txHash, setTxHash] = useState<string>('');

  const resetStatus = useCallback(() => {
    setStatus('idle');
    setCurrentStep(0);
    setTxHash('');
  }, []);

  const updateStatus = useCallback((newStatus: typeof status, step?: number, hash?: string) => {
    setStatus(newStatus);
    if (step !== undefined) setCurrentStep(step);
    if (hash) setTxHash(hash);
  }, []);

  return {
    status,
    currentStep,
    txHash,
    resetStatus,
    updateStatus,
  };
}
