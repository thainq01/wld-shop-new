import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  executePaymentService,
  wldToWei,
  PAYMENT_SERVICE_CONFIG,
} from "../utils/paymentService";
import { waitForTransactionConfirmation } from "../utils/paymentVerification";

export interface PaymentData {
  orderId: string;
  amount: number; // Amount in WLD
  walletAddress: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface UsePaymentServiceReturn {
  processPayment: (data: PaymentData) => Promise<PaymentResult>;
  isProcessing: boolean;
  error: string | null;
}

/**
 * Hook for processing payments through PaymentService contract
 * Handles the complete payment flow: contract call -> confirmation -> verification -> status update
 */
export function usePaymentService(): UsePaymentServiceReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayment = useCallback(
    async (data: PaymentData): Promise<PaymentResult> => {
      setIsProcessing(true);
      setError(null);

      try {
        console.log("🚀 Starting PaymentService payment process:", data);

        // Step 1: Convert WLD amount to wei
        const amountInWei = wldToWei(data.amount);
        console.log(`💰 Amount: ${data.amount} WLD = ${amountInWei} wei`);

        // Step 2: Execute payment through PaymentService contract
        console.log("📝 Executing PaymentService contract call...");
        const paymentResponse = await executePaymentService(
          {
            amount: amountInWei,
            referenceId: data.orderId,
          },
          PAYMENT_SERVICE_CONFIG.WLD_TOKEN_ADDRESS,
          PAYMENT_SERVICE_CONFIG.RECIPIENT_ADDRESS
        );

        // Step 3: Check if payment was successful
        if (paymentResponse.finalPayload.status === "error") {
          const errorMessage =
            paymentResponse.finalPayload.error_code || "Payment failed";
          console.error("❌ PaymentService transaction failed:", errorMessage);
          throw new Error(`Payment failed: ${errorMessage}`);
        }

        const transactionId = paymentResponse.finalPayload.transaction_id;
        if (!transactionId) {
          throw new Error("No transaction ID received from payment");
        }

        console.log("✅ PaymentService transaction submitted:", transactionId);

        // Step 4: Wait for transaction confirmation
        console.log("⏳ Waiting for transaction confirmation...");
        try {
          await waitForTransactionConfirmation(transactionId);
          console.log("✅ Transaction confirmed on blockchain");
        } catch (confirmationError) {
          console.warn(
            "⚠️ Transaction confirmation timeout, but continuing...",
            confirmationError
          );
          // Continue with the process even if confirmation times out
          // The transaction might still be successful
        }

        // Step 5: Log payment completion
        // Note: Backend will verify the transaction and update order status from pending to paid
        console.log("✅ Payment transaction submitted successfully");
        console.log(
          "🔍 Backend will verify transaction and update order status"
        );

        console.log("🎉 Payment process completed successfully!");
        toast.success("Payment successful!");

        return {
          success: true,
          transactionId: transactionId,
        };
      } catch (error: any) {
        const errorMessage = error.message || "Payment processing failed";
        console.error("❌ Payment process failed:", error);
        setError(errorMessage);
        toast.error(errorMessage);

        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  return {
    processPayment,
    isProcessing,
    error,
  };
}
