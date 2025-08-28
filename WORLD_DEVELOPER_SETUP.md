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
4. Add the following contract address:
   ```
   0x8f894C64de54bE90c256C7fbd51ff2240Ee82F1b
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

**Related Addresses (for reference)**

- WLD Token: `0x2cFc85d8E48F8EAB294be644d9E25C3030863003`
- Recipient: `0x5744c7c3b2825f6478673676015657a9c81594ba`

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
6. **Check for whitelist error**: Look for the "🚨 CONTRACT WHITELIST ERROR" message

This will help you see exactly what's happening during the payment flow on mobile devices!
