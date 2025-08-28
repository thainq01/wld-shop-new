import { MiniKit, SendTransactionInput } from "@worldcoin/minikit-js";

// PaymentService contract ABI - only the pay function we need
export const PAYMENT_SERVICE_ABI = [
  {
    type: "function",
    name: "pay",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "referenceId",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
];

// WLD Token ABI - for approve function
export const WLD_TOKEN_ABI = [
  {
    type: "function",
    name: "approve",
    inputs: [
      {
        name: "spender",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
      {
        name: "spender",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
];

// PaymentService contract addresses from CTO data
export const PAYMENT_SERVICE_CONFIG = {
  // Use transparent proxy address for contract calls
  CONTRACT_ADDRESS: "0x8f894C64de54bE90c256C7fbd51ff2240Ee82F1b",
  // WLD token address
  WLD_TOKEN_ADDRESS: "0x2cFc85d8E48F8EAB294be644d9E25C3030863003",
  // Recipient address (where payments go)
  RECIPIENT_ADDRESS: "0x5744c7c3b2825f6478673676015657a9c81594ba",
};

/**
 * Validate Ethereum address format
 * @param address The address to validate
 * @returns true if valid address format
 */
function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate payment service configuration
 * @throws Error if any configuration is invalid
 */
function validatePaymentConfig(): void {
  if (!isValidEthereumAddress(PAYMENT_SERVICE_CONFIG.CONTRACT_ADDRESS)) {
    throw new Error("Invalid PaymentService contract address");
  }
  if (!isValidEthereumAddress(PAYMENT_SERVICE_CONFIG.WLD_TOKEN_ADDRESS)) {
    throw new Error("Invalid WLD token address");
  }
  if (!isValidEthereumAddress(PAYMENT_SERVICE_CONFIG.RECIPIENT_ADDRESS)) {
    throw new Error("Invalid recipient address");
  }
}

/**
 * Execute payment through PaymentService contract
 * @param data Payment data including amount and reference ID
 * @param tokenAddress Token contract address (defaults to WLD)
 * @param toAddress Recipient address (defaults to configured recipient)
 * @returns Transaction response from MiniKit
 */
export async function executePaymentService(
  data: {
    amount: string; // Amount in wei (18 decimals)
    referenceId: string; // Order ID or reference
  },
  tokenAddress: string = PAYMENT_SERVICE_CONFIG.WLD_TOKEN_ADDRESS,
  toAddress: string = PAYMENT_SERVICE_CONFIG.RECIPIENT_ADDRESS
) {
  // Validate MiniKit installation
  if (!MiniKit.isInstalled()) {
    throw new Error("MiniKit is not installed");
  }

  // Log contract addresses for debugging
  console.log("🔍 Contract Configuration Debug:");
  console.log("Contract Address:", PAYMENT_SERVICE_CONFIG.CONTRACT_ADDRESS);
  console.log("WLD Token Address:", PAYMENT_SERVICE_CONFIG.WLD_TOKEN_ADDRESS);
  console.log("Recipient Address:", PAYMENT_SERVICE_CONFIG.RECIPIENT_ADDRESS);
  console.log("Token Address (param):", tokenAddress);
  console.log("To Address (param):", toAddress);

  // Validate payment configuration
  try {
    validatePaymentConfig();
  } catch (error) {
    console.error("❌ Payment configuration validation failed:", error);
    throw error;
  }

  // Validate input parameters
  if (!data.amount || data.amount === "0") {
    throw new Error("Invalid payment amount");
  }

  if (!data.referenceId || data.referenceId.trim() === "") {
    throw new Error("Invalid reference ID");
  }

  if (!isValidEthereumAddress(tokenAddress)) {
    throw new Error("Invalid token address");
  }

  if (!isValidEthereumAddress(toAddress)) {
    throw new Error("Invalid recipient address");
  }

  // Validate amount is a valid number string
  try {
    BigInt(data.amount);
  } catch {
    throw new Error("Invalid amount format");
  }

  const payload: SendTransactionInput = {
    transaction: [
      {
        address: PAYMENT_SERVICE_CONFIG.CONTRACT_ADDRESS,
        abi: PAYMENT_SERVICE_ABI,
        functionName: "pay",
        args: [tokenAddress, toAddress, data.amount, data.referenceId],
      },
    ],
  };

  console.log("📝 SUBMITTING CONTRACT TRANSACTION:");
  console.log("=====================================");
  console.log("⏰ Submission Time:", new Date().toISOString());
  console.log("🎯 Contract Address:", PAYMENT_SERVICE_CONFIG.CONTRACT_ADDRESS);
  console.log("⚡ Function:", "pay");
  console.log("📊 Arguments:");
  console.log("   - Token Address:", tokenAddress);
  console.log("   - Recipient Address:", toAddress);
  console.log("   - Amount (wei):", data.amount);
  console.log("   - Reference ID:", data.referenceId);
  console.log("🔧 Full Payload:", JSON.stringify(payload, null, 2));

  const startTime = performance.now();

  try {
    const response = await MiniKit.commandsAsync.sendTransaction(payload);

    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    console.log("✅ CONTRACT SUBMISSION RESPONSE:");
    console.log("=================================");
    console.log("⏱️ Response Time:", duration + "ms");
    console.log("⏰ Response Received:", new Date().toISOString());
    console.log("📦 Raw Response:", JSON.stringify(response, null, 2));

    if (response?.finalPayload) {
      console.log("📋 Final Payload Details:");
      console.log("   - Status:", response.finalPayload.status);

      if (response.finalPayload.status === "success") {
        const successPayload = response.finalPayload as {
          transaction_id?: string;
          app_id?: string;
        };
        console.log(
          "   - Transaction ID:",
          successPayload.transaction_id || "N/A"
        );
        console.log("   - App ID:", successPayload.app_id || "N/A");
      } else if (response.finalPayload.status === "error") {
        const errorPayload = response.finalPayload as {
          error_code?: string;
          app_id?: string;
        };
        console.log("   - Error Code:", errorPayload.error_code || "N/A");
        console.log("   - App ID:", errorPayload.app_id || "N/A");
      }
    }

    // Validate response structure
    if (!response || !response.finalPayload) {
      console.error("❌ INVALID RESPONSE STRUCTURE");
      throw new Error("Invalid response from MiniKit");
    }

    if (response.finalPayload.status === "success") {
      console.log("🎉 CONTRACT SUBMISSION SUCCESSFUL!");
    } else if (response.finalPayload.status === "error") {
      console.error("🚨 CONTRACT SUBMISSION FAILED!");
      const errorPayload = response.finalPayload as { error_code?: string };
      console.error("Error Code:", errorPayload.error_code || "Unknown error");
    }

    return response;
  } catch (error: unknown) {
    console.error("❌ PaymentService transaction failed:", error);

    // Map specific MiniKit errors to user-friendly messages
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : "Unknown payment error";

    if (
      errorMessage.includes("invalid contract") ||
      errorMessage.includes("Invalid contract")
    ) {
      console.error("🚨 CONTRACT WHITELIST ERROR:");
      console.error(
        "The PaymentService contract is not whitelisted in World Developer Portal"
      );
      console.error(
        "Contract Address:",
        PAYMENT_SERVICE_CONFIG.CONTRACT_ADDRESS
      );
      console.error("📋 To fix this:");
      console.error("1. Go to https://developer.worldcoin.org/");
      console.error("2. Navigate to Configuration → Advanced");
      console.error("3. Add this contract address to the whitelist:");
      console.error("   " + PAYMENT_SERVICE_CONFIG.CONTRACT_ADDRESS);
      throw new Error("invalid_contract");
    }

    if (
      errorMessage.includes("user_rejected") ||
      errorMessage.includes("User rejected")
    ) {
      throw new Error("user_rejected");
    }

    if (errorMessage.includes("disallowed_operation")) {
      console.error("🚨 TOKEN OPERATION NOT ALLOWED:");
      console.error(
        "ERC20 token operations (approve/transfer) are not whitelisted"
      );
      console.error(
        "WLD Token Address:",
        PAYMENT_SERVICE_CONFIG.WLD_TOKEN_ADDRESS
      );
      console.error("📋 To fix this:");
      console.error("1. Go to https://developer.worldcoin.org/");
      console.error("2. Navigate to Configuration → Advanced");
      console.error("3. Add WLD token address to Smart Contract Whitelist:");
      console.error("   " + PAYMENT_SERVICE_CONFIG.WLD_TOKEN_ADDRESS);
      console.error(
        "4. Ensure both approve() and transfer() functions are allowed"
      );
      throw new Error("disallowed_operation");
    }

    if (errorMessage.includes("insufficient allowance")) {
      console.error("🚨 ERC20 ALLOWANCE ERROR:");
      console.error(
        "The PaymentService contract doesn't have permission to spend WLD tokens"
      );
      console.error("User needs to approve token spending first");
      console.error(
        "WLD Token Address:",
        PAYMENT_SERVICE_CONFIG.WLD_TOKEN_ADDRESS
      );
      console.error(
        "PaymentService Address:",
        PAYMENT_SERVICE_CONFIG.CONTRACT_ADDRESS
      );
      throw new Error("insufficient_allowance");
    }

    if (errorMessage.includes("insufficient")) {
      throw new Error("insufficient_balance");
    }

    if (errorMessage.includes("network")) {
      throw new Error("invalid_network");
    }

    // Re-throw the original error for other cases
    throw error;
  }
}

/**
 * Convert WLD amount to wei (multiply by 10^18)
 * @param wldAmount Amount in WLD
 * @returns Amount in wei as string
 */
export function wldToWei(wldAmount: number): string {
  return BigInt(Math.floor(wldAmount * 1e18)).toString();
}

/**
 * Convert wei to WLD amount (divide by 10^18)
 * @param weiAmount Amount in wei
 * @returns Amount in WLD
 */
export function weiToWld(weiAmount: string): number {
  return Number(BigInt(weiAmount)) / 1e18;
}

/**
 * Check current WLD token allowance for PaymentService contract
 * @param ownerAddress The wallet address that owns the tokens
 * @returns Current allowance amount in wei as string
 */
export async function checkWLDAllowance(ownerAddress: string): Promise<string> {
  if (!MiniKit.isInstalled()) {
    throw new Error("MiniKit is not installed");
  }

  console.log("🔍 CHECKING WLD TOKEN ALLOWANCE:");
  console.log("================================");
  console.log("Owner Address:", ownerAddress);
  console.log(
    "Spender (PaymentService):",
    PAYMENT_SERVICE_CONFIG.CONTRACT_ADDRESS
  );
  console.log("Token Address:", PAYMENT_SERVICE_CONFIG.WLD_TOKEN_ADDRESS);

  try {
    // Note: MiniKit doesn't support view functions directly
    // This would typically require a read-only RPC call
    // For now, we'll simulate this or use a fallback approach
    console.log("⚠️ Allowance checking via MiniKit view calls not implemented");
    console.log("💡 Consider using web3 provider for view functions");

    // Return "0" as default to force approval flow
    // In a real implementation, you'd make a read call to the blockchain
    return "0";
  } catch (error: unknown) {
    console.error("❌ Failed to check allowance:", error);
    // Return "0" on error to trigger approval flow
    return "0";
  }
}

/**
 * Check if current allowance is sufficient for payment
 * @param ownerAddress The wallet address that owns the tokens
 * @param requiredAmount Required amount in wei
 * @returns true if allowance is sufficient, false otherwise
 */
export async function hassufficientAllowance(
  ownerAddress: string,
  requiredAmount: string
): Promise<boolean> {
  try {
    const currentAllowance = await checkWLDAllowance(ownerAddress);
    const allowanceBN = BigInt(currentAllowance);
    const requiredBN = BigInt(requiredAmount);

    console.log("💰 ALLOWANCE CHECK:");
    console.log("   Current Allowance (wei):", currentAllowance);
    console.log("   Required Amount (wei):", requiredAmount);
    console.log("   Sufficient?", allowanceBN >= requiredBN);

    return allowanceBN >= requiredBN;
  } catch (error) {
    console.error("❌ Error checking allowance sufficiency:", error);
    return false; // Assume insufficient on error
  }
}

/**
 * Approve WLD token spending for PaymentService contract
 * @param amount Amount in wei to approve
 * @returns Transaction response from MiniKit
 */
export async function approveWLDSpending(amount: string) {
  if (!MiniKit.isInstalled()) {
    throw new Error("MiniKit is not installed");
  }

  console.log("💰 APPROVING WLD TOKEN SPENDING:");
  console.log("================================");
  console.log("Token Address:", PAYMENT_SERVICE_CONFIG.WLD_TOKEN_ADDRESS);
  console.log(
    "Spender (PaymentService):",
    PAYMENT_SERVICE_CONFIG.CONTRACT_ADDRESS
  );
  console.log("Amount to approve (wei):", amount);

  const payload: SendTransactionInput = {
    transaction: [
      {
        address: PAYMENT_SERVICE_CONFIG.WLD_TOKEN_ADDRESS,
        abi: WLD_TOKEN_ABI,
        functionName: "approve",
        args: [PAYMENT_SERVICE_CONFIG.CONTRACT_ADDRESS, amount],
      },
    ],
  };

  console.log("🔧 Approval Payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await MiniKit.commandsAsync.sendTransaction(payload);
    console.log(
      "✅ TOKEN APPROVAL RESPONSE:",
      JSON.stringify(response, null, 2)
    );
    return response;
  } catch (error: unknown) {
    console.error("❌ Token approval failed:", error);
    throw error;
  }
}

/**
 * Smart payment function that checks allowance and approves if needed
 * @param data Payment data including amount and reference ID
 * @param ownerAddress The wallet address that owns the tokens
 * @param tokenAddress Token contract address (defaults to WLD)
 * @param toAddress Recipient address (defaults to configured recipient)
 * @returns Transaction response from MiniKit
 */
export async function executeSmartPayment(
  data: {
    amount: string; // Amount in wei (18 decimals)
    referenceId: string; // Order ID or reference
  },
  ownerAddress: string,
  tokenAddress: string = PAYMENT_SERVICE_CONFIG.WLD_TOKEN_ADDRESS,
  toAddress: string = PAYMENT_SERVICE_CONFIG.RECIPIENT_ADDRESS
) {
  console.log("🧠 SMART PAYMENT FLOW:");
  console.log("======================");
  console.log("Amount needed (wei):", data.amount);
  console.log("Owner address:", ownerAddress);

  // Step 1: Check if allowance is sufficient
  const hasSufficientAllowance = await hassufficientAllowance(
    ownerAddress,
    data.amount
  );

  if (!hasSufficientAllowance) {
    console.log("💰 Insufficient allowance detected - approving tokens...");

    // Step 2: Approve tokens if needed
    const approvalResponse = await approveWLDSpending(data.amount);

    if (approvalResponse.finalPayload.status === "error") {
      const errorPayload = approvalResponse.finalPayload as {
        error_code?: string;
      };
      console.error("❌ Token approval failed:", errorPayload.error_code);
      throw new Error(errorPayload.error_code || "approval_failed");
    }

    console.log("✅ Token approval successful");
  } else {
    console.log("✅ Sufficient allowance detected - proceeding with payment");
  }

  // Step 3: Execute payment
  console.log("💳 Executing payment...");
  return await executePaymentService(data, tokenAddress, toAddress);
}

/**
 * Diagnostic function to check payment service configuration
 * Call this in browser console to debug contract setup issues
 */
export function diagnosticPaymentService() {
  console.log("🔍 PaymentService Diagnostic Report");
  console.log("=====================================");

  // Check MiniKit installation
  console.log("1. MiniKit Status:");
  console.log("   Installed:", MiniKit.isInstalled());

  // Check contract addresses
  console.log("\n2. Contract Configuration:");
  console.log("   PaymentService:", PAYMENT_SERVICE_CONFIG.CONTRACT_ADDRESS);
  console.log("   WLD Token:", PAYMENT_SERVICE_CONFIG.WLD_TOKEN_ADDRESS);
  console.log("   Recipient:", PAYMENT_SERVICE_CONFIG.RECIPIENT_ADDRESS);

  // Validate addresses
  console.log("\n3. Address Validation:");
  const contractValid = isValidEthereumAddress(
    PAYMENT_SERVICE_CONFIG.CONTRACT_ADDRESS
  );
  const tokenValid = isValidEthereumAddress(
    PAYMENT_SERVICE_CONFIG.WLD_TOKEN_ADDRESS
  );
  const recipientValid = isValidEthereumAddress(
    PAYMENT_SERVICE_CONFIG.RECIPIENT_ADDRESS
  );

  console.log("   Contract Address Valid:", contractValid);
  console.log("   Token Address Valid:", tokenValid);
  console.log("   Recipient Address Valid:", recipientValid);

  // Check whitelist status
  console.log("\n4. Whitelist Status:");
  console.log("   ⚠️  Cannot check whitelist status programmatically");
  console.log("   📋 Manual Check Required:");
  console.log("   1. Go to https://developer.worldcoin.org/");
  console.log("   2. Check Configuration → Advanced");
  console.log(
    "   3. Verify contract is whitelisted:",
    PAYMENT_SERVICE_CONFIG.CONTRACT_ADDRESS
  );

  console.log("\n5. ABI Configuration:");
  console.log(
    "   PaymentService Functions:",
    PAYMENT_SERVICE_ABI.map((item) => item.name)
  );
  console.log(
    "   WLD Token Functions:",
    WLD_TOKEN_ABI.map((item) => item.name)
  );

  console.log("\n6. Available Functions:");
  console.log("   - executePaymentService() - Basic payment");
  console.log("   - executeSmartPayment() - Auto-approval + payment");
  console.log("   - checkWLDAllowance() - Check current allowance");
  console.log("   - hassufficientAllowance() - Check if allowance is enough");
  console.log("   - approveWLDSpending() - Approve token spending");

  return {
    minikit: MiniKit.isInstalled(),
    addresses: {
      contract: contractValid,
      token: tokenValid,
      recipient: recipientValid,
    },
    config: PAYMENT_SERVICE_CONFIG,
  };
}
