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
  Copy,
  ExternalLink,
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

interface WalletItem {
  address: string;
  quantity: number;
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
  data: CartItem[]; // Changed: API returns array of items, not cart objects
  statusCode: number;
}

export function CartManager() {
  const [cartData, setCartData] = useState<CartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedWallets, setExpandedWallets] = useState<Set<string>>(
    new Set()
  );
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"wallet" | "items">("wallet");

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

      if (result.success && Array.isArray(result.data)) {
        console.log("Raw cart data:", result.data);

        // Group cart items by wallet address
        const cartMap = new Map<string, CartData>();

        result.data.forEach((item) => {
          const walletAddress = item.walletAddress;

          // Normalize the item data
          const normalizedItem: CartItem = {
            ...item,
            productPrice: item.productPrice ?? 0,
            lineTotal: item.lineTotal ?? 0,
            quantity: item.quantity ?? 0,
            size: item.size ?? "",
            productName: item.productName ?? "Unknown Product",
          };

          if (cartMap.has(walletAddress)) {
            // Add item to existing cart
            const existing = cartMap.get(walletAddress)!;
            existing.items.push(normalizedItem);
            existing.totalItems += 1;
            existing.totalQuantity += normalizedItem.quantity;
            existing.totalAmount += normalizedItem.lineTotal;
          } else {
            // Create new cart entry
            cartMap.set(walletAddress, {
              walletAddress,
              items: [normalizedItem],
              totalItems: 1,
              totalQuantity: normalizedItem.quantity,
              totalAmount: normalizedItem.lineTotal,
              currency: item.currency || "WLD",
              languageCode: item.languageCode || "en",
            });
          }
        });

        // Convert map back to array
        const normalizedData = Array.from(cartMap.values());
        console.log("Normalized cart data:", normalizedData);
        setCartData(normalizedData);
      } else {
        throw new Error("API returned unsuccessful response");
      }
    } catch (error) {
      console.error("Error loading cart data:", error);
      toast.error("Failed to load cart data");
      setCartData([]); // Set empty array on error
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

  const toggleItemExpansion = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
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

  const copyWalletAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success("Wallet address copied to clipboard");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openWorldscan = (address: string) => {
    window.open(`https://worldscan.org/address/${address}`, "_blank");
  };

  // Get all items flattened for items view
  const getAllItems = () => {
    return cartData.flatMap((cart) =>
      (cart.items || []).map((item) => ({
        ...item,
        walletAddress: cart.walletAddress,
      }))
    );
  };

  // Group items by product for accordion view
  const getGroupedItems = () => {
    const allItems = getAllItems();
    const grouped = new Map();

    allItems.forEach((item) => {
      const key = `${item.productId}-${item.size || "no-size"}`;

      if (grouped.has(key)) {
        const existing = grouped.get(key);
        existing.wallets.push({
          address: item.walletAddress,
          quantity: item.quantity || 0,
          lineTotal: item.lineTotal || 0,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        });
        existing.totalQuantity += item.quantity || 0;
        existing.totalValue += item.lineTotal || 0;
      } else {
        grouped.set(key, {
          ...item,
          wallets: [
            {
              address: item.walletAddress,
              quantity: item.quantity || 0,
              lineTotal: item.lineTotal || 0,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            },
          ],
          totalQuantity: item.quantity || 0,
          totalValue: item.lineTotal || 0,
          walletCount: 1,
        });
      }
    });

    // Update wallet counts
    grouped.forEach((item) => {
      item.walletCount = item.wallets.length;
    });

    return Array.from(grouped.values());
  };

  const filteredCartData = cartData.filter(
    (cart) =>
      cart &&
      cart.walletAddress &&
      (cart.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cart.items || []).some(
          (item) =>
            item &&
            item.productName &&
            item.productName.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  const filteredGroupedItems = getGroupedItems().filter(
    (item) =>
      (item &&
        item.productName &&
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.wallets.some((wallet: WalletItem) =>
        wallet.address.toLowerCase().includes(searchTerm.toLowerCase())
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
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("wallet")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === "wallet"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Wallet className="w-4 h-4" />
              By Wallet
            </button>
            <button
              onClick={() => setViewMode("items")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === "items"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Package className="w-4 h-4" />
              By Items
            </button>
          </div>
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
                {cartData.reduce(
                  (sum, cart) => sum + (cart.totalItems || 0),
                  0
                )}
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
                {cartData.reduce(
                  (sum, cart) => sum + (cart.totalQuantity || 0),
                  0
                )}
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
                  .reduce((sum, cart) => sum + (cart.totalAmount || 0), 0)
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
        {viewMode === "wallet" ? (
          // Wallet View (Original View)
          filteredCartData.length === 0 ? (
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
              {filteredCartData.map((cart, index) => (
                <div key={`${cart.walletAddress}-${index}`} className="p-4">
                  {/* Wallet Header */}
                  <div className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-3 transition-colors">
                    <button
                      onClick={() => toggleWalletExpansion(cart.walletAddress)}
                      className="flex items-center space-x-3 flex-1"
                    >
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
                          {cart.totalItems || 0} items •{" "}
                          {cart.totalQuantity || 0} qty •{" "}
                          {(cart.totalAmount || 0).toFixed(2)} WLD
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {(cart.items || []).length}{" "}
                        {(cart.items || []).length === 1
                          ? "product"
                          : "products"}
                      </span>

                      {/* Wallet Action Buttons */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyWalletAddress(cart.walletAddress);
                          }}
                          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                          title="Copy wallet address"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openWorldscan(cart.walletAddress);
                          }}
                          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                          title="Open in Worldscan"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Cart Items */}
                  {expandedWallets.has(cart.walletAddress) && (
                    <div className="mt-4 ml-8 space-y-3">
                      {(cart.items || []).map((item, itemIndex) => (
                        <div
                          key={`${
                            item.id || `${cart.walletAddress}-item-${itemIndex}`
                          }`}
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
                              <span>Size: {item.size || "N/A"}</span>
                              <span>Qty: {item.quantity || 0}</span>
                              <span>
                                Price: {(item.productPrice || 0).toFixed(2)} WLD
                              </span>
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
                              {(item.lineTotal || 0).toFixed(2)} WLD
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
          )
        ) : // Items View with Accordion - Grouped by Product
        filteredGroupedItems.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No items found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "Try adjusting your search."
                : "No cart items available."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredGroupedItems.map((item, index) => {
              const itemKey = `item-${item.productId}-${
                item.size || "no-size"
              }-${index}`;
              const isExpanded = expandedItems.has(itemKey);

              return (
                <div key={itemKey} className="p-4">
                  {/* Item Header */}
                  <div className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-3 transition-colors">
                    <button
                      onClick={() => toggleItemExpansion(itemKey)}
                      className="flex items-center space-x-3 flex-1"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                      <Package className="w-5 h-5 text-green-500" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.walletCount} wallets • Total Qty:{" "}
                          {item.totalQuantity} • Total Value:{" "}
                          {item.totalValue.toFixed(2)} WLD
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {item.walletCount}{" "}
                        {item.walletCount === 1 ? "wallet" : "wallets"}
                      </span>
                    </div>
                  </div>

                  {/* Item Details - Expanded View */}
                  {isExpanded && (
                    <div className="mt-4 ml-8 space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        {/* Product Summary */}
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
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
                                <Package className="w-10 h-10 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                              {item.productName}
                            </h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                  Product ID
                                </p>
                                <p className="text-gray-900 dark:text-white">
                                  {item.productId}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                  Size
                                </p>
                                <p className="text-gray-900 dark:text-white">
                                  {item.size || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                  Unit Price
                                </p>
                                <p className="text-gray-900 dark:text-white">
                                  {(item.productPrice || 0).toFixed(2)} WLD
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                          <div className="text-center">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              {item.walletCount}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Total Wallets
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              {item.totalQuantity}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Total Quantity
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              {item.totalValue.toFixed(2)} WLD
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Total Value
                            </p>
                          </div>
                        </div>

                        {/* Wallet List */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                            Wallets with this item:
                          </h5>
                          <div className="space-y-2">
                            {item.wallets.map(
                              (wallet: WalletItem, walletIndex: number) => (
                                <div
                                  key={`${wallet.address}-${walletIndex}`}
                                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                                >
                                  <div className="flex items-center space-x-3">
                                    <Wallet className="w-4 h-4 text-blue-500" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatWalletAddress(wallet.address)}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Added: {formatDate(wallet.createdAt)}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                      <p className="text-sm text-gray-900 dark:text-white">
                                        Qty: {wallet.quantity} •{" "}
                                        {wallet.lineTotal.toFixed(2)} WLD
                                      </p>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          copyWalletAddress(wallet.address);
                                        }}
                                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                                        title="Copy wallet address"
                                      >
                                        <Copy className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openWorldscan(wallet.address);
                                        }}
                                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                                        title="Open in Worldscan"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
