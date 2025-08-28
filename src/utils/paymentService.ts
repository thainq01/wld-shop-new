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
  if (!MiniKit.isInstalled()) {
    throw new Error("MiniKit is not installed");
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
  
  const response = await MiniKit.commandsAsync.sendTransaction(payload);
  console.log("PaymentService response:", response);
  
  return response;
}

/**
 * Convert WLD amount to wei (multiply by 10^18)
 * @param wldAmount Amount in WLD
 * @returns Amount in wei as string
 */
export function wldToWei(wldAmount: number): string {
  return (BigInt(Math.floor(wldAmount * 1e18))).toString();
}

/**
 * Convert wei to WLD amount (divide by 10^18)
 * @param weiAmount Amount in wei
 * @returns Amount in WLD
 */
export function weiToWld(weiAmount: string): number {
  return Number(BigInt(weiAmount)) / 1e18;
}
