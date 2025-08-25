import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Package,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Calendar,
  DollarSign,
  Hash,
} from "lucide-react";

import { BottomNavigation } from "../BottomNavigation";
import { useTranslation } from "react-i18next";
import { useAuthWorld } from "../../store/authStore";
import { LoginButton } from "../LoginButton";

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
      description: string;
      isActive: boolean;
      language: string | null;
      createdAt: string;
    };
    category: string;
    material: string;
    madeBy: string;
    inStock: string;
    featured: boolean;
    otherDetails: string;
    language: string | null;
    sizes: any;
    images: any;
    createdAt: string;
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
  totalAmount: number;
  status: string;
  products: OrderHistoryProduct[];
  createdAt: string;
  updatedAt: string;
}

interface OrderHistoryResponse {
  success: boolean;
  data: OrderHistoryItem[];
  statusCode: number;
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
}

const HistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { address: walletAddress } = useAuthWorld();
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderHistory();
  }, [walletAddress]);

  const fetchOrderHistory = async () => {
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8086/api/checkout?walletAddress=${encodeURIComponent(
          walletAddress
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: OrderHistoryResponse = await response.json();

      if (result.success) {
        setOrders(result.data);
      } else {
        setError("Failed to fetch order history");
      }
    } catch (err) {
      console.error("Error fetching order history:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch order history"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
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
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
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
              Login Required
            </h2>

            {/* Description text */}
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-12">
              Please sign in with your World ID to view your order history
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
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate("/explore")}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate("/explore")}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchOrderHistory}
              className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              {t("tryAgain")}
            </button>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 mb-20">
      {/* Header */}
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t("orderHistory")}
          </h2>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-10 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t("noOrdersYet")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 px-4">
              {t("noOrdersMessage")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-gray-400" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {t("orderId")}
                          {(order.orderId || order.id.toString()).toUpperCase()}
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
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
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
                        {order.totalAmount.toFixed(2)} WLD
                      </span>
                    </div>

                    {/* Products */}
                    <div className="py-3 border-b border-gray-100 dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                        Products Ordered
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
                                    "Product Name Not Available"}
                                </h5>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Qty: {item.quantity || 0} ×{" "}
                                  {item.priceAtPurchase || 0} WLD
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Collection:{" "}
                                  {item.product?.collection?.name || "N/A"}
                                </p>
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.lineTotal || 0} WLD
                              </span>
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
                      <div className="flex items-start space-x-2">
                        <Package className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {order.firstName} {order.lastName}
                        </span>
                      </div>

                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatAddress(order)}
                        </span>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {order.email}
                        </span>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {order.phone}
                        </span>
                      </div>
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
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default HistoryScreen;
