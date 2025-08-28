# PaymentService Integration

This document describes the PaymentService integration for processing WLD payments through smart contracts.

## Overview

The PaymentService integration allows users to make payments using WLD tokens through a smart contract. The payment flow ensures that payments are processed before orders are saved to the database.

## Architecture

### Components

1. **PaymentService Utility** (`src/utils/paymentService.ts`)

   - Contract interaction functions
   - WLD/Wei conversion utilities
   - Contract configuration

2. **Payment Verification** (`src/utils/paymentVerification.ts`)

   - Transaction confirmation waiting
   - Payment verification with backend
   - Checkout status updates

3. **Payment Hook** (`src/hooks/usePaymentService.ts`)

   - React hook for payment processing
   - State management for payment flow
   - Error handling

4. **Checkout Integration** (`src/components/CheckoutScreen/index.tsx`)
   - Updated checkout flow
   - Payment-first approach
   - Success/error handling

## Contract Details

### PaymentService Contract

- **Address**: `0x8f894C64de54bE90c256C7fbd51ff2240Ee82F1b` (Transparent Proxy)
- **Implementation**: `0x9e21cb99b617210A2b84443a4d41DA4474CF8926`
- **Network**: World Chain Mainnet

### Contract Function

```solidity
function pay(
    address token,      // WLD token address
    address to,         // Recipient address
    uint256 amount,     // Amount in wei
    string calldata referenceId  // Order ID
) external;
```

### Configuration

```typescript
export const PAYMENT_SERVICE_CONFIG = {
  CONTRACT_ADDRESS: "0x8f894C64de54bE90c256C7fbd51ff2240Ee82F1b",
  WLD_TOKEN_ADDRESS: "0x2cFc85d8E48F8EAB294be644d9E25C3030863003",
  RECIPIENT_ADDRESS: "0x5744c7c3b2825f6478673676015657a9c81594ba",
};
```

## Payment Flow

### 1. User Initiates Payment

- User fills checkout form
- Clicks "Pay Now" button
- Form validation passes

### 2. Payment Processing

```typescript
const paymentResult = await processPayment({
  orderId: generatedOrderId,
  amount: total, // in WLD
  walletAddress: address,
});
```

### 3. Smart Contract Execution

- Convert WLD amount to wei
- Call PaymentService contract
- Wait for transaction confirmation

### 4. Order Creation

- Only after successful payment
- Create checkout with "pending" status
- Backend will verify transaction and update to "paid"
- Navigate to success page

## Usage Examples

### Basic Payment Processing

```typescript
import { usePaymentService } from "../hooks/usePaymentService";

function CheckoutComponent() {
  const { processPayment, isProcessing, error } = usePaymentService();

  const handlePayment = async () => {
    const result = await processPayment({
      orderId: "ORDER_123",
      amount: 10.5, // 10.5 WLD
      walletAddress: "0x...",
    });

    if (result.success) {
      console.log("Payment successful:", result.transactionId);
    } else {
      console.error("Payment failed:", result.error);
    }
  };

  return (
    <button onClick={handlePayment} disabled={isProcessing}>
      {isProcessing ? "Processing..." : "Pay Now"}
    </button>
  );
}
```

### Direct Contract Interaction

```typescript
import { executePaymentService, wldToWei } from "../utils/paymentService";

const paymentResponse = await executePaymentService({
  amount: wldToWei(10.5), // Convert to wei
  referenceId: "ORDER_123",
});
```

## Error Handling

### Common Errors

- **MiniKit not installed**: User needs World App
- **Insufficient balance**: User doesn't have enough WLD
- **Transaction failed**: Network or contract error
- **Payment submitted but order creation failed**: Critical error requiring manual intervention

### Error Recovery

```typescript
try {
  const result = await processPayment(data);
} catch (error) {
  if (error.message.includes("Payment submitted but")) {
    // Payment went through but order creation failed
    // Show special error message with transaction details
    showCriticalError(error.message);
  } else {
    // Regular payment failure
    showPaymentError(error.message);
  }
}
```

## Testing

### Unit Tests

```bash
npm test src/utils/__tests__/paymentService.test.ts
```

### Integration Testing

1. Test with World App simulator
2. Use testnet for contract testing
3. Verify payment flow end-to-end

## Backend Integration

### Transaction Verification

The backend should:

1. **Monitor PaymentService contract events** for new payments
2. **Verify transaction details** (amount, recipient, orderId)
3. **Update order status** from "pending" to "paid" after verification
4. **Handle edge cases** like duplicate payments or failed verifications

### Recommended Backend Flow

```typescript
// Backend service to monitor and verify payments
async function verifyPayment(orderId: string, transactionId: string) {
  // 1. Get transaction details from blockchain
  const transaction = await getTransactionDetails(transactionId);

  // 2. Verify transaction called PaymentService contract
  if (transaction.to !== PAYMENT_SERVICE_ADDRESS) {
    throw new Error("Invalid contract address");
  }

  // 3. Decode transaction data to verify parameters
  const decodedData = decodePaymentData(transaction.data);
  if (decodedData.referenceId !== orderId) {
    throw new Error("Order ID mismatch");
  }

  // 4. Update order status
  await updateOrderStatus(orderId, "paid", transactionId);
}
```

## Security Considerations

1. **Amount Validation**: Always validate amounts on both frontend and backend
2. **Transaction Verification**: Backend must verify transactions on blockchain before marking as paid
3. **Idempotency**: Handle duplicate payments gracefully
4. **Error Recovery**: Provide clear recovery paths for failed states
5. **Order Status**: Never trust frontend status - backend verification is required

## Monitoring

### Key Metrics

- Payment success rate
- Transaction confirmation time
- Error rates by type
- User abandonment at payment step

### Logging

- All payment attempts are logged
- Transaction IDs are tracked
- Error details are captured for debugging

## Future Enhancements

1. **Multi-token Support**: Support other tokens besides WLD
2. **Payment Verification API**: Dedicated backend endpoint for payment verification
3. **Retry Logic**: Automatic retry for failed transactions
4. **Payment History**: Track user payment history
5. **Refund Support**: Handle payment refunds through smart contract
