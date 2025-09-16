import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useWLDPayment, usePaymentStatus } from "../../hooks/useWLDPayment";

interface WLDPaymentButtonProps {
  amount: number; // Amount in WLD
  orderId: string;
  onPaymentSuccess?: (txHash: string) => void;
  onPaymentError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  wldBalance?: number | null;
}

export function WLDPaymentButton({
  amount,
  orderId,
  onPaymentSuccess,
  onPaymentError,
  disabled = false,
  className = "",
  wldBalance = null,
}: WLDPaymentButtonProps) {
  const { t } = useTranslation();
  const { isLoading, transferByTokenExact } = useWLDPayment();
  const { status, resetStatus, updateStatus } = usePaymentStatus();

  // Check if user has enough balance
  const hasEnoughBalance = useMemo(() => {
    if (wldBalance === null) return false;
    return wldBalance >= amount;
  }, [wldBalance, amount]);

  const shortfallAmount = useMemo(() => {
    if (wldBalance === null || wldBalance >= amount) return 0;
    return amount - wldBalance;
  }, [wldBalance, amount]);

  const handleWldClientPayment = async () => {
    try {
      resetStatus();
      updateStatus("paying", 1);

      // Use exact wld-prediction-client pattern
      const result = await transferByTokenExact({
        amount: amount.toString(),
        orderId: orderId,
      });

      if (!result.success) {
        throw new Error(result.error || "WLD Client payment failed");
      }

      updateStatus("completed", 1, result.txHash);
      onPaymentSuccess?.(result.txHash || "");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "WLD Client payment failed";
      updateStatus("failed", 1);
      onPaymentError?.(errorMessage);
    }
  };

  const isButtonDisabled =
    disabled || isLoading || !hasEnoughBalance || status === "paying";

  const getButtonText = () => {
    if (status === "paying") return t("processingPayment");
    if (status === "completed") return t("paymentSuccessfulButton");
    if (status === "failed") return t("paymentFailedRetry");
    if (!hasEnoughBalance)
      return t("insufficientBalance", { amount: shortfallAmount.toFixed(2) });
    if (isLoading) return t("processing");
    return t("payWLD", { amount: amount.toFixed(2) });
  };

  const getButtonColor = () => {
    if (status === "completed") return "bg-green-500 hover:bg-green-600";
    if (status === "failed") return "bg-red-500 hover:bg-red-600";
    if (isButtonDisabled) return "bg-gray-400 cursor-not-allowed";
    return "bg-blue-600 hover:bg-blue-700";
  };

  return (
    <div className={`wld-payment-container ${className}`}>
      {/* Payment Progress */}
      {status === "paying" && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-sm text-blue-800">Processing payment...</span>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {!hasEnoughBalance && wldBalance !== null && (
        <div className="mb-4 p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-800">
            {t("insufficientWLDBalance", {
              amount: shortfallAmount.toFixed(2),
            })}
          </p>
        </div>
      )}

      {status === "failed" && (
        <div className="mb-4 p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-800">
            Payment failed. Please try again or contact support if the issue
            persists.
          </p>
        </div>
      )}

      {status === "completed" && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            {t("paymentCompletedSuccessfully")}
          </p>
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handleWldClientPayment}
        disabled={isButtonDisabled}
        className={`
          w-full py-3 px-4 rounded-lg font-medium text-white transition-colors
          ${getButtonColor()}
        `}
      >
        {getButtonText()}
      </button>
    </div>
  );
}
