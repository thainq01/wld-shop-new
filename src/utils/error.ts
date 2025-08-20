import { t } from "i18next";

export function mergeAPIError(error: any) {
  if (Array.isArray(error?.errors) && error?.errors.length > 0) {
    const txt = error.errors.map((i: any) => i?.message).join("\n");

    return error?.detail ? `${error?.detail}: - ${txt}` : txt;
  }
  return (
    error?.errors?.[0]?.message ||
    error?.detail ||
    error?.title ||
    error?.error ||
    error?.message
  );
}

export function ErrorMessage(error: string) {
  switch (error) {
    case "input_error":
      return t("Input Error");

    case "payment_rejected":
      return t("User cancelled payment");

    case "invalid_receiver":
      return t("Invalid Receiver");

    case "insufficient_balance":
      return t("Insufficient Balance");

    case "transaction_failed":
      return t("Transaction Failed");

    case "generic_error":
      return t("Transaction Failed");

    case "user_blocked":
      return t("User Blocked");

    case "daily_tx_limit_reached":
      return t("World app only allow 25 transactions/day");

    case "user_rejected":
      return t("User rejected");
    // verification error
    case "verification_rejected":
      return t("User rejected");

    case "max_verifications_reached":
      return t("User cannot verify for this action again");

    case "credential_unavailable":
      return t("This user does not have the requested credential");

    case "malformed_request":
      return t(
        "The request payload couldn't be decrypted or did not conform to the standard"
      );

    case "invalid_network":
      return t("invalid_network");

    case "inclusion_proof_failed":
      return t("inclusion_proof_failed");

    case "inclusion_proof_pending":
      return t("inclusion_proof_pending");

    case "unexpected_response":
      return t("unexpected_response");

    case "invalid_contract":
      return t("Invalid Contract");

    case "simulation_failed":
      return t("simulation_failed");

    case "invalid_operation":
      return t("invalid_operation");

    case "MAX_HARD_CAP_REACHED":
      return "Purchase amount exceeds allowed limit.";

    case "USER_REJECTED_METHODS":
      return "User Rejected";

    case "network_congestion":
      return t("network_congestion");

    default:
      return error;
  }
}
