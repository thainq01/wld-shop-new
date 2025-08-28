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

  console.log("PaymentService payload:", payload);

  try {
    const response = await MiniKit.commandsAsync.sendTransaction(payload);
    console.log("PaymentService response:", response);

    // Validate response structure
    if (!response || !response.finalPayload) {
      throw new Error("Invalid response from MiniKit");
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
    "   Functions:",
    PAYMENT_SERVICE_ABI.map((item) => item.name)
  );

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
