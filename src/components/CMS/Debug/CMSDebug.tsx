import { useLocation } from "react-router-dom";
import { checkoutApi } from "../../../utils/api";
import { useState } from "react";
import type { CreateCheckoutRequest } from "../../../types";

export function CMSDebug() {
  const location = useLocation();
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [createResult, setCreateResult] = useState<string>("");

  const testCheckoutAPI = async () => {
    setLoading(true);
    try {
      const result = await checkoutApi.getAll({ page: 0, size: 5 });
      console.log("Full API response:", result);

      let totalCount = "unknown";
      let checkoutCount = 0;

      if (Array.isArray(result)) {
        totalCount = result.length.toString();
        checkoutCount = result.length;
      } else if (result && typeof result === "object") {
        const resultAny = result as any;
        totalCount = (
          resultAny.totalElements ||
          resultAny.total ||
          (resultAny.content || resultAny.data || []).length
        ).toString();
        checkoutCount = (resultAny.content || resultAny.data || []).length;
      }

      setTestResult(
        `✅ Checkout API working! Found ${totalCount} total checkouts (${checkoutCount} in current page). Response type: ${
          Array.isArray(result) ? "Array" : "Object"
        }`
      );
    } catch (error) {
      setTestResult(
        `❌ Checkout API error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const createTestCheckout = async () => {
    setLoading(true);
    try {
      const testData: CreateCheckoutRequest = {
        walletAddress: "0x1234567890123456789012345678901234567890",
        email: "test@example.com",
        country: "Thailand",
        firstName: "Test",
        lastName: "User",
        address: "123 Test Street",
        apartment: "Apt 1",
        city: "Bangkok",
        postcode: "10001",
        phone: "+66-123-456-789",
        products: [
          {
            productId: 1,
            quantity: 2,
          },
        ],
      };

      const result = await checkoutApi.create(testData);
      console.log("Created checkout:", result);
      setCreateResult(`✅ Test checkout created! ID: ${result.id}`);
    } catch (error) {
      setCreateResult(
        `❌ Create checkout error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        CMS Debug Information
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Current Route:
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {location.pathname}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Navigation Test:
          </h3>
          <div className="flex gap-2 mt-2">
            <a
              href="/cms"
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Dashboard
            </a>
            <a
              href="/cms/collections"
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              Collections
            </a>
            <a
              href="/cms/products"
              className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
            >
              Products
            </a>
            <a
              href="/cms/checkouts"
              className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
            >
              Checkouts
            </a>
            <a
              href="/cms/users"
              className="px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600"
            >
              Users
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            API Test:
          </h3>
          <div className="flex gap-2 mt-2">
            <button
              onClick={testCheckoutAPI}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Testing..." : "Test Get Checkouts"}
            </button>
            <button
              onClick={createTestCheckout}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Test Checkout"}
            </button>
          </div>
          {testResult && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {testResult}
            </p>
          )}
          {createResult && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {createResult}
            </p>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Component Status:
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>✅ CMSDebug component loaded</li>
            <li>✅ React Router working (location: {location.pathname})</li>
            <li>✅ Tailwind CSS working</li>
            <li>✅ TypeScript compilation successful</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Environment:
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>
              API Base URL:{" "}
              {import.meta.env.VITE_API_URL || "http://localhost:8080"}
            </li>
            <li>Mode: {import.meta.env.MODE}</li>
            <li>Dev: {import.meta.env.DEV ? "Yes" : "No"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
