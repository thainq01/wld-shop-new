import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Package,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Hash,
  Truck,
  ExternalLink,
  Copy,
} from "lucide-react";

import { BottomNavigation } from "../BottomNavigation";
import { useTranslation } from "react-i18next";
import { useAuthWorld } from "../../store/authStore";
import { LoginButton } from "../LoginButton";
import { checkoutApi } from "../../utils/api";
import type {
  ProductSize,
  ProductImage,
  Checkout,
  CheckoutProductResponse,
} from "../../types";

interface OrderHistoryProduct {
  id: number;
  checkoutId: number;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    collection: {
      id: number;
      name: string;
      slug: string;
    } | null;
    category: string;
    material: string;
    madeBy: string;
    inStock: string;
    featured: boolean;
    otherDetails: string;
    language: string | null;
    sizes: ProductSize[] | null;
    images: ProductImage[] | null;
    createdAt: string;
    updatedAt?: string;
  };
  quantity: number;
  priceAtPurchase: number;
  lineTotal: number;
  createdAt: string;
  updatedAt: string;
}

interface OrderHistoryItem {
  id: number;
  orderId: string;
  walletAddress: string;
  email: string;
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string | null;
  city: string;
  postcode: string;
  phone: string;
  language?: string;
  totalAmount: string;
  status: string;
  transactionHash?: string;
  carrier?: string | null;
  trackingCode?: string | null;
  products: OrderHistoryProduct[];
  createdAt: string;
  updatedAt: string;
}

const HistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { address: walletAddress } = useAuthWorld();
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<number | null>(null);

  const fetchOrderHistory = useCallback(async () => {
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const result = await checkoutApi.getByWalletAddress(walletAddress);

      console.log("API Result:", result);
      console.log("API Result Data:", result?.data);
      console.log("API Result Content:", result?.data?.content);

      // Check different possible response structures
      let checkouts: Checkout[] = [];

      if (result?.data?.content && Array.isArray(result.data.content)) {
        // Standard paginated response
        checkouts = result.data.content;
        console.log("Using paginated response structure");
      } else if (result?.data && Array.isArray(result.data)) {
        // Direct array response
        checkouts = result.data;
        console.log("Using direct array response structure");
      } else if (result && Array.isArray(result)) {
        // Direct array result
        checkouts = result;
        console.log("Using direct array result structure");
      } else {
        console.warn("API returned unexpected data structure:", result);
        console.warn("No recognizable checkout data found");
        setOrders([]);
        return;
      }

      console.log("Found checkouts:", checkouts);
      console.log("Number of checkouts:", checkouts.length);

      if (checkouts.length === 0) {
        console.log("No checkouts found, setting empty orders");
        setOrders([]);
        return;
      }

      // Map Checkout[] to OrderHistoryItem[]
      const mappedOrders: OrderHistoryItem[] = checkouts.map((checkout) => ({
        id: checkout.id,
        orderId: checkout.orderId || checkout.id.toString(),
        walletAddress: checkout.walletAddress,
        email: checkout.email,
        country: checkout.country,
        firstName: checkout.firstName,
        lastName: checkout.lastName,
        address: checkout.address,
        apartment: checkout.apartment || null,
        city: checkout.city,
        postcode: checkout.postcode,
        phone: checkout.phone,
        totalAmount: checkout.totalAmount || "0",
        status: checkout.status || "pending",
        carrier: checkout.carrier,
        trackingCode: checkout.trackingCode,
        products:
          checkout.products?.map((product: CheckoutProductResponse) => ({
            id: product.id,
            checkoutId: checkout.id,
            product: product.product,
            quantity: product.quantity,
            priceAtPurchase: product.product.price,
            lineTotal: product.product.price * product.quantity,
            createdAt: checkout.createdAt,
            updatedAt: checkout.updatedAt,
          })) || [],
        createdAt: checkout.createdAt,
        updatedAt: checkout.updatedAt,
      }));

      setOrders(mappedOrders);
    } catch (err) {
      console.error("Error fetching order history:", err);

      // Provide more detailed error information
      let errorMessage = "Failed to fetch order history";
      if (err instanceof Error) {
        errorMessage = err.message;

        // Add more context for common errors
        if (
          err.message.includes("Failed to fetch") ||
          err.message.includes("fetch")
        ) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (err.message.includes("404")) {
          errorMessage = "Order history service is temporarily unavailable.";
        } else if (err.message.includes("500")) {
          errorMessage = "Server error. Please try again later.";
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatAddress = (order: OrderHistoryItem) => {
    const parts = [
      order.address,
      order.apartment,
      order.city,
      order.postcode,
      order.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "out for delivery":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "paid":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "confirmed":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return t("paid");
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const truncateCode = (code: string, maxLength: number = 12) => {
    if (!code || code.length <= maxLength) return code;
    const start = Math.floor(maxLength / 2) - 1;
    const end = Math.ceil(maxLength / 2) - 2;
    return `${code.substring(0, start)}...${code.substring(code.length - end)}`;
  };

  // Login required state when no wallet
  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        {/* Content centered in screen */}
        <div className="flex-1 flex items-center justify-center px-4 pb-20">
          <div className="text-center max-w-sm">
            {/* Clock icon (matching empty state style) */}
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-400 rounded-full flex items-center justify-center">
              <Clock className="w-16 h-16 text-white" />
            </div>

            {/* Login required text */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t("loginRequired")}
            </h2>

            {/* Description text */}
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-12">
              {t("signInWithWorldIdHistory")}
            </p>

            {/* Login button */}
            <LoginButton />
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"></div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              {t("loadingOrderHistory")}
            </p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        {/* Error state - centered and styled like empty state */}
        <div className="flex-1 flex items-center justify-center px-4 pb-20">
          <div className="text-center max-w-sm">
            {/* Error icon */}
            <div className="w-32 h-32 mx-auto mb-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <Clock className="w-16 h-16 text-red-600 dark:text-red-400" />
            </div>

            {/* Error title */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Error Loading History
            </h2>

            {/* Error message */}
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-12">
              {error}
            </p>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={fetchOrderHistory}
                disabled={loading}
                className="w-[250px] py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("retrying") : t("tryAgain")}
              </button>
            </div>
          </div>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col pb-20">
      {orders.length === 0 ? (
        <>
          {/* Empty state - centered and styled like bag empty state */}
          <div className="flex-1 flex items-center justify-center px-4 pb-20">
            <div className="text-center max-w-sm">
              {/* Clock icon */}
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-400 rounded-full flex items-center justify-center">
                <Clock className="w-16 h-16 text-white" />
              </div>

              {/* No orders text */}
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {t("noOrdersYet")}
              </h2>

              {/* Description text */}
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
                {t("orderHistoryDisplayedHere")}
              </p>

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/explore")}
                  className="w-[250px] py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  {t("explore")}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Header for orders list */}
          <div className="px-4 pt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t("orderHistory")}
              </h2>
            </div>
          </div>

          <div className="w-full mx-auto py-6 pb-10 space-y-4 px-4">
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden w-full"
                >
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Package className="w-5 h-5 text-gray-400" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {t("orderId")}
                            {(
                              order.orderId || order.id.toString()
                            ).toUpperCase()}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-3">
                      {/* Total Amount */}
                      <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {t("totalAmount")}
                          </span>
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {order.totalAmount} WLD
                        </span>
                      </div>

                      {/* Products */}
                      <div className="py-3 border-b border-gray-100 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                          {t("productsOrdered")}
                        </h4>
                        <div className="space-y-3">
                          {order.products && order.products.length > 0 ? (
                            order.products.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                              >
                                <div className="flex-1">
                                  <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                                    {item.product?.name ||
                                      t("productNameNotAvailable")}
                                  </h5>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t("quantity")}: {item.quantity || 0}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                No products found
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="space-y-2">
                        {/* Determine if this order is a giftcard order */}
                        {(() => {
                          const isGiftcardOrder =
                            (order.carrier && order.carrier === "giftcard") ||
                            (order.products &&
                              order.products.length > 0 &&
                              order.products.every(
                                (p) =>
                                  p.product?.collection?.slug === "giftcard"
                              ));

                          return (
                            <>
                              {/* Name - Hidden for giftcard orders */}
                              {!isGiftcardOrder && (
                                <div className="flex items-start space-x-2">
                                  <Package className="w-4 h-4 text-gray-400 mt-0.5" />
                                  <span className="text-sm text-gray-900 dark:text-white">
                                    {order.firstName} {order.lastName}
                                  </span>
                                </div>
                              )}

                              {/* Email - Hidden for giftcard orders */}
                              {!isGiftcardOrder && (
                                <div className="flex items-start space-x-2">
                                  <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {order.email}
                                  </span>
                                </div>
                              )}

                              {/* Address + Phone for non-giftcard orders only */}
                              {!isGiftcardOrder && (
                                <>
                                  <div className="flex items-start space-x-2">
                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      {formatAddress(order)}
                                    </span>
                                  </div>

                                  <div className="flex items-start space-x-2">
                                    <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      {order.phone}
                                    </span>
                                  </div>
                                </>
                              )}

                              {/* Giftcard information - show voucher/tracking code with copy */}
                              {isGiftcardOrder && (
                                <div className="pt-2 border-gray-100 dark:border-gray-700">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Truck className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      {t("giftcardDeliveryTitle")}
                                    </span>
                                  </div>

                                  <div className="ml-6 flex items-center gap-3">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {t("voucherCode")}:
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <code className="font-mono text-sm bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded">
                                        {order.trackingCode
                                          ? truncateCode(order.trackingCode)
                                          : "-"}
                                      </code>
                                      <button
                                        onClick={async () => {
                                          if (!order.trackingCode) return;
                                          try {
                                            await navigator.clipboard.writeText(
                                              order.trackingCode
                                            );
                                            setCopiedCodeId(order.id);
                                            setTimeout(
                                              () => setCopiedCodeId(null),
                                              2000
                                            );
                                          } catch (err) {
                                            console.error("Copy failed:", err);
                                          }
                                        }}
                                        className="inline-flex items-center justify-center p-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        title={t("copyCode")}
                                      >
                                        {copiedCodeId === order.id ? (
                                          <span className="text-xs font-medium">
                                            {t("copied")}
                                          </span>
                                        ) : (
                                          <Copy className="w-4 h-4" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })()}

                        {/* Shipping Tracking Info - Only for non-giftcard orders */}
                        {(() => {
                          const isGiftcardOrder =
                            (order.carrier && order.carrier === "giftcard") ||
                            (order.products &&
                              order.products.length > 0 &&
                              order.products.every(
                                (p) =>
                                  p.product?.collection?.slug === "giftcard"
                              ));

                          return (
                            !isGiftcardOrder &&
                            (order.carrier || order.trackingCode) && (
                              <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Truck className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t("shippingInformation")}
                                  </span>
                                </div>
                                {order.carrier && (
                                  <div className="ml-6 mb-1">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      Carrier:
                                    </span>
                                    <span className="ml-1 text-xs text-gray-700 dark:text-gray-300 font-medium">
                                      {order.carrier}
                                    </span>
                                  </div>
                                )}
                                {order.trackingCode && (
                                  <div className="ml-6">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      Tracking:
                                    </span>
                                    <button
                                      onClick={() =>
                                        order.trackingCode &&
                                        window.open(
                                          order.trackingCode,
                                          "_blank"
                                        )
                                      }
                                      className="ml-2 inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                    >
                                      Click here
                                      <ExternalLink className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            )
                          );
                        })()}
                      </div>

                      {/* Order ID */}
                      <div className="flex items-center space-x-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          ID: {order.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <BottomNavigation />
    </div>
  );
};

export default HistoryScreen;
