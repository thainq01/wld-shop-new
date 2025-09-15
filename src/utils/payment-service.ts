import { MiniKit, SendTransactionInput } from "@worldcoin/minikit-js";
import BigNumber from "bignumber.js";

export const PAYMENT_CONSTANTS = {
  WLD_TOKEN: "0x2cFc85d8E48F8EAB294be644d9E25C3030863003",
  PAYMENT_SERVICE_CONTRACT: "0x8f894C64de54bE90c256C7fbd51ff2240Ee82F1b",
  RECIPIENT_ADDRESS: "0x5744c7c3b2825f6478673676015657a9c81594ba",
  WLD_DECIMALS: 18,
};

export interface PaymentParams {
  amount: string; // Amount in WLD (e.g., "10.5")
  orderId: string; // Order ID - will be mapped to referenceId parameter in contract
  recipientAddress?: string; // Optional, will use default if not provided
}

/**
 * Transfer using exact wld-prediction-client pattern
 * This is the EXACT same implementation as wld-prediction-client/src/utils/transfer-token.tsx
 * Uses signatureTransfer with referenceId parameter - should work perfectly
 */
export async function transferByTokenExact(params: PaymentParams) {
  const { amount, orderId, recipientAddress } = params;

  if (!MiniKit.isInstalled()) {
    throw new Error("MiniKit is not installed");
  }

  // Convert amount to wei (18 decimals) - exact same as wld-prediction-client
  const amountInWei = new BigNumber(amount)
    .multipliedBy(Math.pow(10, PAYMENT_CONSTANTS.WLD_DECIMALS))
    .toFixed();

  const permitTransfer = {
    permitted: {
      token: PAYMENT_CONSTANTS.WLD_TOKEN, // The token I'm sending
      amount: amountInWei.toString(),
    },
    nonce: Date.now().toString(),
    deadline: Math.floor((Date.now() + 60 * 1000) / 1000).toString(), // 60 seconds like wld-prediction-client
  };

  const transferDetails = {
    to: recipientAddress || PAYMENT_CONSTANTS.RECIPIENT_ADDRESS,
    requestedAmount: amountInWei.toString(),
  };

  const payload: SendTransactionInput = {
    transaction: [
      {
        address: PAYMENT_CONSTANTS.PAYMENT_SERVICE_CONTRACT, // spender
        abi: WLD_PREDICTION_CLIENT_ABI, // Use exact same ABI as wld-prediction-client
        functionName: "signatureTransfer",
        args: [
          [
            [permitTransfer.permitted.token, permitTransfer.permitted.amount],
            permitTransfer.nonce,
            permitTransfer.deadline,
          ],
          [transferDetails.to, transferDetails.requestedAmount],
          orderId, // referenceId - this is the key parameter!
          "PERMIT2_SIGNATURE_PLACEHOLDER_0", // Placeholders will automatically be replaced with the correct signature.
        ],
      },
    ],
    permit2: [
      {
        ...permitTransfer,
        spender: PAYMENT_CONSTANTS.PAYMENT_SERVICE_CONTRACT,
      }, // If you have more than one permit2 you can add more values here.
    ],
  };

  console.debug("Transfer By Token Exact Payload: ", payload);

  const response = await MiniKit.commandsAsync.sendTransaction(payload);
  console.log("Transfer By Token Exact Response: ", response);

  return response;
}

// Exact ABI from wld-prediction-client for signatureTransfer
const WLD_PREDICTION_CLIENT_ABI = [
  {
    type: "function",
    name: "signatureTransfer",
    inputs: [
      {
        name: "permitTransferFrom",
        type: "tuple",
        internalType: "struct ISignatureTransfer.PermitTransferFrom",
        components: [
          {
            name: "permitted",
            type: "tuple",
            internalType: "struct ISignatureTransfer.TokenPermissions",
            components: [
              {
                name: "token",
                type: "address",
                internalType: "address",
              },
              {
                name: "amount",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "deadline", type: "uint256", internalType: "uint256" },
        ],
      },
      {
        name: "transferDetails",
        type: "tuple",
        internalType: "struct ISignatureTransfer.SignatureTransferDetails",
        components: [
          { name: "to", type: "address", internalType: "address" },
          {
            name: "requestedAmount",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
      { name: "referenceId", type: "string", internalType: "string" },
      { name: "signature", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

/**
 * Wait for transaction receipt - based on wld-prediction-client pattern
 */
export async function waitForTransactionReceipt(transactionId: string): Promise<string> {
  const pollingInterval = 4000; // 4 seconds

  return new Promise((resolve, reject) => {
    const pollHash = async () => {
      try {
        const response = await fetch(
          `https://developer.worldcoin.org/api/v2/minikit/transaction/${transactionId}?app_id=${import.meta.env.VITE_APP_ID}&type=transaction`,
          {
            method: 'GET',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch transaction status');
        }

        const data = await response.json();

        if (data.transactionHash) {
          console.log('Transaction confirmed:', data.transactionHash);
          resolve(data.transactionHash);
        } else if (data.status === 'failed') {
          reject(new Error('Transaction failed'));
        } else {
          // Still pending, continue polling
          setTimeout(pollHash, pollingInterval);
        }
      } catch (error) {
        console.error('Error during polling:', error);
        reject(error);
      }
    };

    pollHash();
  });
}

/**
 * Get error message from error code
 */
export function getErrorMessage(errorCode?: string): string {
  const errorMessages: Record<string, string> = {
    'disallowed_operation': 'This operation is not allowed. Please try a different payment method.',
    'insufficient_funds': 'Insufficient funds in your wallet.',
    'user_rejected': 'Transaction was rejected by user.',
    'network_error': 'Network error occurred. Please try again.',
    'timeout': 'Transaction timed out. Please try again.',
  };

  return errorMessages[errorCode || ''] || `Payment failed with error: ${errorCode || 'Unknown error'}`;
}