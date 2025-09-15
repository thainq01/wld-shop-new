/**
 * Test utility to verify checkout functionality with transaction hash
 * This can be used for manual testing or integration tests
 */

import type { CreateCheckoutRequest } from '../types';

export const createTestCheckoutData = (
  transactionHash?: string,
  totalAmount?: string,
  language?: string
): CreateCheckoutRequest => {
  return {
    orderId: `TEST-ORDER-${Date.now()}`,
    walletAddress: "0x54596090f1ac0e136c177b2951bfbe9fc00f6798",
    email: "customer@example.com",
    country: "United States",
    firstName: "John",
    lastName: "Doe",
    address: "123 Main Street",
    apartment: "Apt 4B",
    city: "New York",
    postcode: "10001",
    phone: "1234567890",
    language: language || "en",
    totalAmount: totalAmount || "1.50",
    status: "pending",
    transactionHash: transactionHash || "0xc7af72fe13cdee2510230e1f26f1723e161e2ca573c85606aa30a4261c7dc17a",
    products: [
      {
        productId: 1,
        size: "S",
        quantity: 1
      }
    ]
  };
};

export const validateCheckoutData = (data: CreateCheckoutRequest): boolean => {
  // Basic validation
  if (!data.walletAddress || !data.email || !data.firstName || !data.lastName) {
    console.error('Missing required fields');
    return false;
  }

  if (!data.products || data.products.length === 0) {
    console.error('No products in checkout');
    return false;
  }

  if (data.transactionHash && !data.transactionHash.startsWith('0x')) {
    console.error('Invalid transaction hash format');
    return false;
  }

  if (data.totalAmount && isNaN(parseFloat(data.totalAmount))) {
    console.error('Invalid total amount format');
    return false;
  }

  if (data.language && !['en', 'th', 'ms', 'ph', 'id'].includes(data.language)) {
    console.error('Invalid language code');
    return false;
  }

  return true;
};

export const logCheckoutData = (data: CreateCheckoutRequest): void => {
  console.log('=== Checkout Data ===');
  console.log('Order ID:', data.orderId);
  console.log('Wallet Address:', data.walletAddress);
  console.log('Email:', data.email);
  console.log('Name:', `${data.firstName} ${data.lastName}`);
  console.log('Address:', `${data.address}, ${data.city}, ${data.postcode}`);
  console.log('Country:', data.country);
  console.log('Language:', data.language || 'Not provided');
  console.log('Total Amount:', data.totalAmount || 'Not provided');
  console.log('Status:', data.status);
  console.log('Transaction Hash:', data.transactionHash || 'Not provided');
  console.log('Products:', data.products.length);
  console.log('=====================');
};
