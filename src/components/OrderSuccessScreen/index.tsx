/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Package, MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { BottomNavigation } from "../BottomNavigation";
import type { OrderSuccessResponse } from "../../types";

const OrderSuccessScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }, []);

  
  // Get order data from location state
  const getOrderData = (): OrderSuccessResponse | null => {
    // First try location state
    if (location.state?.orderData) {
      return location.state.orderData;
    }
    
    // No localStorage fallback needed for smooth navigation
    
    // No order data found, return null
    console.error("❌ No order data found");
    return null;
  };

  const orderData: OrderSuccessResponse | null = getOrderData();

  // If no order data, redirect to explore
  if (!orderData) {
    console.log("🔄 No order data found, redirecting to explore...");
    navigate("/explore", { replace: true });
    return null;
  }



  console.log("OrderSuccessScreen - Full orderData:", orderData);
  console.log("OrderSuccessScreen - Location state:", location.state);

  // More robust data extraction - handle different possible response structures
  let order: any = null;
  if (orderData && typeof orderData === 'object') {
    // Try different possible structures
    if ('data' in orderData && orderData.data) {
      order = orderData.data;
    // eslint-disable-next-line no-dupe-else-if
    } else if ('success' in orderData && 'data' in orderData && orderData.data) {
      order = orderData.data;
    } else if ('id' in orderData) {
      // If the response is directly the order data
      order = orderData;
    }
  }

  // Safety check - if no order data, show error state
  if (!order) {
    console.log("OrderSuccessScreen - No order data found, showing error state");
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            No Order Data Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Unable to display order information.
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Debug: orderData = {JSON.stringify(orderData, null, 2)}
          </p>
          <button
            onClick={() => navigate('/explore')}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const formatAddress = () => {
    try {
      const parts = [
        order.address,
        order.apartment,
        order.city,
        order.postcode,
        order.country
      ].filter(Boolean);
      return parts.join(', ');
    } catch (error) {
      console.error("Error formatting address:", error);
      return "Address not available";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pt-10">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4"
          >
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6">
            <div className="items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order Details
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {order.createdAt ? formatDate(order.createdAt) : "N/A"}
              </span>
            </div>

            {/* Order ID */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Order ID
              </span>
              <span className="text-sm font-mono text-gray-900 dark:text-white">
                {order.orderId || "N/A"}
              </span>
            </div>

                         {/* Total Amount */}
             <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
               <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                 Total Amount
               </span>
               <span className="text-lg font-bold text-gray-900 dark:text-white">
                 ${(parseFloat(order.totalAmount) || 0).toFixed(2)}
               </span>
             </div>

                           {/* Order Status */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  order.status === 'delivered'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : order.status === 'out for delivery'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    : order.status === 'paid'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                    : order.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'N/A'}
                </span>
              </div>

            {/* Products */}
            <div className="py-3">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                Products Ordered
              </h3>
              <div className="space-y-3">
                {order.products && order.products.length > 0 ? (
                  order.products.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.product?.name || "Product Name Not Available"}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity || 0}
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
          </div>
        </motion.div>

        {/* Shipping Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Shipping Information
            </h2>
            
            <div className="space-y-4">
              {/* Customer Name */}
              <div className="flex items-start space-x-3">
                <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {order.firstName || "N/A"} {order.lastName || ""}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formatAddress()}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {order.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {order.phone || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-3"
        >
          <button
            onClick={() => navigate('/explore')}
            className="mb-10 w-full bg-black dark:bg-white text-white dark:text-black py-3 px-6 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Continue Shopping
          </button>
          
          <button
            onClick={() => navigate('/history')}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            View Order History
          </button>
        </motion.div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default OrderSuccessScreen;
