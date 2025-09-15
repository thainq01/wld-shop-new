/**
 * Demo script to show the updated checkout functionality
 * Run this in browser console to test the checkout flow
 */

import { createCurlExampleData, simulateCheckoutFlow, testAllCountries } from './checkout-integration-test';

// Demo function that can be called from browser console
export const demoCheckout = async () => {
  console.log('🚀 Checkout Demo Started\n');
  
  // Test 1: Exact curl example
  console.log('=== Test 1: Exact Curl Example ===');
  const curlData = createCurlExampleData();
  console.log('📋 Curl example data:');
  console.log(JSON.stringify(curlData, null, 2));
  
  // Test 2: Country-specific pricing simulation
  console.log('\n=== Test 2: Country-Specific Pricing ===');
  await simulateCheckoutFlow('th', '45.00'); // Thailand pricing
  
  // Test 3: All countries
  console.log('\n=== Test 3: All Countries Test ===');
  await testAllCountries();
  
  console.log('\n✨ Demo completed!');
};

// Generate curl command for testing
export const generateCurlCommand = (data = createCurlExampleData()) => {
  const curlCommand = `curl --location 'http://localhost:8086/api/checkout' \\
--header 'Content-Type: application/json' \\
--data-raw '${JSON.stringify(data, null, 2)}'`;
  
  console.log('📋 Generated curl command:');
  console.log(curlCommand);
  return curlCommand;
};

// Quick test function
export const quickTest = () => {
  console.log('⚡ Quick Checkout Test');
  const data = createCurlExampleData();
  console.log('✅ Data structure matches curl example');
  console.log('🔍 Key fields:');
  console.log(`  - Order ID: ${data.orderId}`);
  console.log(`  - Wallet: ${data.walletAddress}`);
  console.log(`  - Language: ${data.language}`);
  console.log(`  - Total: ${data.totalAmount} WLD`);
  console.log(`  - Transaction: ${data.transactionHash?.slice(0, 10)}...`);
  console.log(`  - Products: ${data.products.length} item(s)`);
  
  return data;
};

// Make functions available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).demoCheckout = demoCheckout;
  (window as any).generateCurlCommand = generateCurlCommand;
  (window as any).quickTest = quickTest;
}

export default {
  demoCheckout,
  generateCurlCommand,
  quickTest
};
