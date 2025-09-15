/**
 * Integration test for checkout functionality with country-specific pricing
 * This simulates the complete checkout flow with transaction hash and total amount
 */

import type { CreateCheckoutRequest } from '../types';
import { createTestCheckoutData, validateCheckoutData, logCheckoutData } from './checkout-test';

// Test data that matches the curl example
export const createCurlExampleData = (): CreateCheckoutRequest => {
  return {
    orderId: "ORDER-MANUAL-001",
    walletAddress: "0x54596090f1ac0e136c177b2951bfbe9fc00f6798",
    email: "customer@example.com",
    firstName: "John",
    lastName: "Doe",
    address: "123 Main Street",
    apartment: "Apt 4B",
    city: "New York",
    postcode: "10001",
    phone: "1234567890",
    language: "en",
    totalAmount: "1.50",
    transactionHash: "0xc7af72fe13cdee2510230e1f26f1723e161e2ca573c85606aa30a4261c7dc17a",
    products: [
      {
        productId: 1,
        size: "S",
        quantity: 1
      }
    ]
  };
};

// Test different country scenarios
export const createCountrySpecificTestData = (country: string, language: string, totalAmount: string): CreateCheckoutRequest => {
  const countryMap: Record<string, { country: string; city: string; postcode: string }> = {
    'th': { country: 'Thailand', city: 'Bangkok', postcode: '10100' },
    'ms': { country: 'Malaysia', city: 'Kuala Lumpur', postcode: '50000' },
    'ph': { country: 'Philippines', city: 'Manila', postcode: '1000' },
    'id': { country: 'Indonesia', city: 'Jakarta', postcode: '10110' },
    'en': { country: 'United States', city: 'New York', postcode: '10001' }
  };

  const locationData = countryMap[language] || countryMap['en'];

  return {
    orderId: `ORDER-${language.toUpperCase()}-${Date.now()}`,
    walletAddress: "0x54596090f1ac0e136c177b2951bfbe9fc00f6798",
    email: `customer-${language}@example.com`,
    firstName: "John",
    lastName: "Doe",
    address: "123 Main Street",
    apartment: "Apt 4B",
    city: locationData.city,
    postcode: locationData.postcode,
    phone: "1234567890",
    language: language,
    totalAmount: totalAmount,
    transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    products: [
      {
        productId: 1,
        size: "S",
        quantity: 1
      }
    ]
  };
};

// Simulate the complete checkout flow
export const simulateCheckoutFlow = async (
  countryCode: string = 'en',
  mockTotalAmount: string = '1.50'
): Promise<{ success: boolean; data?: CreateCheckoutRequest; error?: string }> => {
  try {
    console.log('🔄 Starting checkout flow simulation...');
    
    // Step 1: Create checkout data with country-specific pricing
    const checkoutData = createCountrySpecificTestData(countryCode, countryCode, mockTotalAmount);
    
    // Step 2: Validate the data
    if (!validateCheckoutData(checkoutData)) {
      throw new Error('Checkout data validation failed');
    }
    
    // Step 3: Log the data (simulating API call)
    console.log('✅ Checkout data validated successfully');
    logCheckoutData(checkoutData);
    
    // Step 4: Simulate API call to backend
    console.log('🌐 Simulating API call to /api/checkout...');
    console.log('📤 Request payload:', JSON.stringify(checkoutData, null, 2));
    
    // Step 5: Simulate successful response
    console.log('✅ Checkout created successfully!');
    console.log(`📧 Order confirmation sent to: ${checkoutData.email}`);
    console.log(`🔗 Transaction hash: ${checkoutData.transactionHash}`);
    console.log(`💰 Total amount: ${checkoutData.totalAmount} WLD`);
    
    return {
      success: true,
      data: checkoutData
    };
    
  } catch (error) {
    console.error('❌ Checkout flow failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Test all supported countries
export const testAllCountries = async (): Promise<void> => {
  const countries = [
    { code: 'en', name: 'English/Global', amount: '1.50' },
    { code: 'th', name: 'Thailand', amount: '45.00' },
    { code: 'ms', name: 'Malaysia', amount: '6.50' },
    { code: 'ph', name: 'Philippines', amount: '85.00' },
    { code: 'id', name: 'Indonesia', amount: '22000.00' }
  ];

  console.log('🌍 Testing checkout for all supported countries...\n');

  for (const country of countries) {
    console.log(`\n=== Testing ${country.name} (${country.code}) ===`);
    const result = await simulateCheckoutFlow(country.code, country.amount);
    
    if (result.success) {
      console.log(`✅ ${country.name} checkout test passed`);
    } else {
      console.log(`❌ ${country.name} checkout test failed: ${result.error}`);
    }
  }

  console.log('\n🎉 All country tests completed!');
};

// Export for use in other files
export { validateCheckoutData, logCheckoutData } from './checkout-test';
