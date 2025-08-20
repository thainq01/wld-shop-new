import React, { useState } from "react";
import { useCheckout } from "../../hooks/useCheckout";
import { useAuthWorld } from "../../store/authStore";
import type { CreateCheckoutRequest } from "../../types";

export const CheckoutTest: React.FC = () => {
  const { address } = useAuthWorld();
  const { 
    createCheckout, 
    getCheckout, 
    getAllCheckouts, 
    getCheckoutProducts,
    isLoading, 
    error, 
    checkout, 
    checkouts,
    checkoutProducts,
    clearError 
  } = useCheckout();

  const [testCheckoutId, setTestCheckoutId] = useState<number>(1);

  const handleCreateTestCheckout = async () => {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    const testData: CreateCheckoutRequest = {
      walletAddress: address,
      email: "test@example.com",
      country: "Thailand",
      firstName: "John",
      lastName: "Doe",
      address: "123 Test Street",
      apartment: "Apt 4B",
      city: "Bangkok",
      postcode: "10001",
      phone: "+66-123-456-789",
      products: [
        {
          productId: 1,
          quantity: 2
        },
        {
          productId: 2,
          quantity: 1
        }
      ]
    };

    await createCheckout(testData);
  };

  const handleGetCheckout = async () => {
    await getCheckout(testCheckoutId);
  };

  const handleGetAllCheckouts = async () => {
    await getAllCheckouts({ page: 0, size: 10 });
  };

  const handleGetCheckoutProducts = async () => {
    await getCheckoutProducts(testCheckoutId);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Checkout API Test
        </h1>

        {/* Wallet Address Display */}
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Wallet Address: {address || "Not connected"}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={clearError}
              className="mt-2 text-sm text-red-600 dark:text-red-400 underline"
            >
              Clear Error
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <p className="text-blue-700 dark:text-blue-300">Loading...</p>
          </div>
        )}

        {/* Test Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleCreateTestCheckout}
            disabled={isLoading || !address}
            className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Test Checkout
          </button>

          <div className="flex gap-2">
            <input
              type="number"
              value={testCheckoutId}
              onChange={(e) => setTestCheckoutId(parseInt(e.target.value) || 1)}
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Checkout ID"
            />
            <button
              onClick={handleGetCheckout}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Get Checkout
            </button>
          </div>

          <button
            onClick={handleGetAllCheckouts}
            disabled={isLoading}
            className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            Get All Checkouts
          </button>

          <button
            onClick={handleGetCheckoutProducts}
            disabled={isLoading}
            className="p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            Get Checkout Products
          </button>
        </div>

        {/* Results Display */}
        <div className="space-y-6">
          {/* Single Checkout */}
          {checkout && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Checkout Details
              </h3>
              <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-auto">
                {JSON.stringify(checkout, null, 2)}
              </pre>
            </div>
          )}

          {/* All Checkouts */}
          {checkouts.length > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                All Checkouts ({checkouts.length})
              </h3>
              <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-auto max-h-96">
                {JSON.stringify(checkouts, null, 2)}
              </pre>
            </div>
          )}

          {/* Checkout Products */}
          {checkoutProducts.length > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Checkout Products ({checkoutProducts.length})
              </h3>
              <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-auto max-h-96">
                {JSON.stringify(checkoutProducts, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
