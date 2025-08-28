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
