import { useState, useEffect } from "react";
import {
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Package,
  Wallet,
  User,
  Calendar,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  id: number;
  walletAddress: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  size: string;
  quantity: number;
  languageCode: string;
  currency: string;
  lineTotal: number;
  createdAt: string;
  updatedAt: string;
}

interface CartData {
  walletAddress: string;
  items: CartItem[];
  totalItems: number;
  totalQuantity: number;
  totalAmount: number;
  currency: string;
  languageCode: string;
}

interface CartResponse {
  success: boolean;
  data: CartData[];
  statusCode: number;
}

export function CartManager() {
  const [cartData, setCartData] = useState<CartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedWallets, setExpandedWallets] = useState<Set<string>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`);

      if (!response.ok) {
        throw new Error("Failed to fetch cart data");
      }

      const result: CartResponse = await response.json();

      if (result.success) {
        setCartData(result.data);
      } else {
        throw new Error("API returned unsuccessful response");
      }
    } catch (error) {
      console.error("Error loading cart data:", error);
      toast.error("Failed to load cart data");
    } finally {
      setLoading(false);
    }
  };

  const toggleWalletExpansion = (walletAddress: string) => {
    const newExpanded = new Set(expandedWallets);
    if (newExpanded.has(walletAddress)) {
      newExpanded.delete(walletAddress);
    } else {
      newExpanded.add(walletAddress);
    }
    setExpandedWallets(newExpanded);
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredCartData = cartData.filter(
    (cart) =>
      cart.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.items.some((item) =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Cart Management
          </h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Cart Management
          </h1>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            View and manage all user shopping carts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total Carts: {cartData.length}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by wallet address or product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>

      {/* Cart Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <ShoppingCart className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {cartData.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Carts
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {cartData.reduce((sum, cart) => sum + cart.totalItems, 0)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Items
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <User className="w-8 h-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {cartData.reduce((sum, cart) => sum + cart.totalQuantity, 0)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Quantity
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {cartData
                  .reduce((sum, cart) => sum + cart.totalAmount, 0)
                  .toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Value (WLD)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Accordion */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
        {filteredCartData.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No carts found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "Try adjusting your search."
                : "No cart data available."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCartData.map((cart) => (
              <div key={cart.walletAddress} className="p-4">
                {/* Wallet Header */}
                <button
                  onClick={() => toggleWalletExpansion(cart.walletAddress)}
                  className="w-full flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-3 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {expandedWallets.has(cart.walletAddress) ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                    <Wallet className="w-5 h-5 text-blue-500" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatWalletAddress(cart.walletAddress)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {cart.totalItems} items • {cart.totalQuantity} qty •{" "}
                        {cart.totalAmount.toFixed(2)} WLD
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {cart.items.length}{" "}
                      {cart.items.length === 1 ? "product" : "products"}
                    </span>
                  </div>
                </button>

                {/* Cart Items */}
                {expandedWallets.has(cart.walletAddress) && (
                  <div className="mt-4 ml-8 space-y-3">
                    {cart.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        {/* Product Image */}
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.productName}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Size: {item.size}</span>
                            <span>Qty: {item.quantity}</span>
                            <span>Price: {item.productPrice} WLD</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Added: {formatDate(item.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Line Total */}
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {item.lineTotal.toFixed(2)} WLD
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Line Total
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
