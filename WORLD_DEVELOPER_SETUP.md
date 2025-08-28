# World Developer Portal Setup Guide

## 🚨 CRITICAL: Contract Whitelist Setup Required

If you're getting the error "invalid contract", this means your PaymentService contract is not whitelisted in the World Developer Portal. This is **required** for all MiniKit apps that interact with smart contracts.

## Current Contract Address

Your PaymentService contract address: `0x8f894C64de54bE90c256C7fbd51ff2240Ee82F1b`

## Step-by-Step Setup

### 1. Access World Developer Portal

- Go to [https://developer.worldcoin.org/](https://developer.worldcoin.org/)
- Log in with your World App credentials

### 2. Navigate to Your App

- Select your app from the dashboard
- If you don't have an app yet, create one first

### 3. Configure Contract Whitelist

1. Go to **Configuration** section in the left sidebar
2. Click on **Advanced** tab
3. Find the **Smart Contract Whitelist** section
4. Add **BOTH** of these contract addresses:
   ```
   PaymentService: 0x8f894C64de54bE90c256C7fbd51ff2240Ee82F1b
   WLD Token: 0x2cFc85d8E48F8EAB294be644d9E25C3030863003
   ```
5. Click **Save** or **Update**

### 4. Verify Other Configurations

#### App URL Configuration

Make sure your app URL is properly configured:

- **Development**: `http://localhost:5173` (or your dev server port)
- **Production**: Your deployed app URL

#### Permissions

Ensure your app has the following permissions:

- ✅ `payment` - Required for WLD payments
- ✅ `read_wallet` - Required to read user's wallet address

### 5. Contract Details to Whitelist

**PaymentService Contract**

- Address: `0x8f894C64de54bE90c256C7fbd51ff2240Ee82F1b`
- Network: World Chain (Optimism-based)
- Purpose: Handles WLD token payments for the e-commerce app

**BOTH Contracts Must Be Whitelisted**

- PaymentService: `0x8f894C64de54bE90c256C7fbd51ff2240Ee82F1b` ✅ **Already added**
- WLD Token: `0x2cFc85d8E48F8EAB294be644d9E25C3030863003` ❌ **ADD THIS TOO**
- Recipient: `0x5744c7c3b2825f6478673676015657a9c81594ba` (for reference)

## Testing the Fix

After whitelisting the contract:

1. **Clear your browser cache** and **restart the World App**
2. Try the payment flow again
3. Check the browser console for the debug logs:
   ```
   🔍 Contract Configuration Debug:
   Contract Address: 0x8f894C64de54bE90c256C7fbd51ff2240Ee82F1b
   ```
4. The payment should now work without the "invalid contract" error

## Troubleshooting

### Still Getting "Invalid Contract" Error?

1. **Double-check the contract address** in the Developer Portal
2. **Verify the app URL** matches your current environment
3. **Wait 5-10 minutes** after saving changes for propagation
4. **Restart the World App** completely
5. **Clear browser cache** and try again

### Other Common Issues

**"MiniKit is not installed"**

- Open the app through World App, not directly in browser

**"User rejected"**

- User cancelled the transaction in World App

**"Insufficient balance"**

- User doesn't have enough WLD tokens

## Need Help?

1. Check the [World Documentation](https://docs.world.org/mini-apps)
2. Join the [World Discord](https://worldcoin.org/discord) for support
3. Review the [MiniKit SDK Reference](https://docs.world.org/mini-apps/reference)

## Development Notes

The error handling in this app will now provide detailed debugging information:

- Contract addresses are logged for verification
- Specific guidance is shown for whitelist errors
- All validation errors include clear next steps

When the contract is properly whitelisted, you should see successful payment transactions with transaction IDs logged to the console.

## Mobile Debugging with Eruda

### Always Available

Eruda is **always enabled** in both development and production builds for debugging the payment flow. This gives you a mobile console to:

- View console logs and errors
- Run the diagnostic function: `window.diagnosticPaymentService()`
- Inspect network requests
- Debug the payment flow on mobile devices
- See the detailed "🚨 CONTRACT WHITELIST ERROR" messages

### How to Access Eruda

1. **Look for the floating button** on the bottom right of your screen when the app loads
2. **Tap the button** to open the Eruda developer tools
3. **Navigate to Console tab** to see logs and run commands

### No Configuration Needed

- ✅ **Development**: Eruda loads automatically
- ✅ **Production**: Eruda loads automatically for debugging
- ✅ **Mobile**: Works perfectly in World App on phones

### Using Eruda for Contract Debugging

1. **Open the app** in World App on your phone
2. **Tap the Eruda button** (floating icon) if visible
3. **Go to Console tab** in Eruda
4. **Run diagnostic**: Type `diagnosticPaymentService()` and press enter
5. **Try payment** and watch the detailed logs in real-time

### Expected Console Logs

When you submit a payment, you'll see detailed logs like:

```
💡 PAYMENT PROCESS DETAILS:
   Order ID: WLD_20241228_ABC123
   Wallet Address: 0x1234...
   Amount (WLD): 1.5
   Amount (wei): 1500000000000000000
   Contract: 0x8f894C64de54bE90c256C7fbd51ff2240Ee82F1b

📝 SUBMITTING CONTRACT TRANSACTION:
=====================================
⏰ Submission Time: 2024-12-28T10:30:45.123Z
🎯 Contract Address: 0x8f894C64de54bE90c256C7fbd51ff2240Ee82F1b
⚡ Function: pay
📊 Arguments:
   - Token Address: 0x2cFc85d8E48F8EAB294be644d9E25C3030863003
   - Recipient Address: 0x5744c7c3b2825f6478673676015657a9c81594ba
   - Amount (wei): 1500000000000000000
   - Reference ID: WLD_20241228_ABC123

✅ CONTRACT SUBMISSION RESPONSE:
=================================
⏱️ Response Time: 1250ms
📋 Final Payload Details:
   - Status: error
   - Error Code: invalid_contract
```

### Look for Contract Whitelist Error

If you see:

```
🚨 CONTRACT WHITELIST ERROR:
The PaymentService contract is not whitelisted in World Developer Portal
```

This confirms you need to whitelist the contract address in the Developer Portal.

### Look for Token Operation Error

If you see:

```
🚨 TOKEN OPERATION NOT ALLOWED:
ERC20 token operations (approve/transfer) are not whitelisted
WLD Token Address: 0x2cFc85d8E48F8EAB294be644d9E25C3030863003
```

This means:

1. **PaymentService contract is whitelisted** ✅ (good progress!)
2. **WLD Token contract is NOT whitelisted** ❌ (needs to be added)
3. **Add WLD token address** to whitelist: `0x2cFc85d8E48F8EAB294be644d9E25C3030863003`

### Look for Token Allowance Error

If you see:

```
🚨 ERC20 ALLOWANCE ERROR:
The PaymentService contract doesn't have permission to spend WLD tokens
User needs to approve token spending first
```

This means:

1. **Both contracts are whitelisted** ✅ (excellent progress!)
2. **User needs to approve** WLD token spending first
3. **Two-step process required**: Approve → Pay

### Smart Payment Flow (Recommended)

The app now includes a **Smart Payment** system that automatically handles allowance:

```
🧠 SMART PAYMENT FLOW:
======================
🔍 Checking allowance...
💰 Insufficient allowance detected - approving tokens...
✅ Token approval successful
💳 Executing payment...
🎉 Payment completed successfully!
```

### Available Payment Functions

1. **Two-Step Payment** - ✅ **NEW & Recommended**: Approve first, then transact
   - `approveTokens()` - Step 1: Approve token spending
   - `executePaymentOnly()` - Step 2: Execute payment after approval
2. **processSmartPayment()** - Auto-checks allowance and approves if needed
3. **processPaymentWithApproval()** - Always approves then pays
4. **processPayment()** - Basic payment (may fail if no allowance)
5. **checkAllowance()** - Check if user has sufficient allowance

### Two-Step Payment UI

The checkout now provides both options:

```
┌─────────────────────────────────────┐
│ Two-Step Payment (Recommended)      │
│                                     │
│ [Step 1: Approve Tokens]           │
│ [Step 2: Execute Payment]          │
│                                     │
│            OR                       │
│                                     │
│ [Pay Now (One-Click)]              │
└─────────────────────────────────────┘
```

This will help you see exactly what's happening during the payment flow on mobile devices!
