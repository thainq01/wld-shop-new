import { X, User, MapPin, Phone, Mail, Wallet, Package, Calendar } from "lucide-react";
import { Checkout, CheckoutProductResponse } from "../../../types";

interface CheckoutDetailsModalProps {
  checkout: Checkout;
  products: CheckoutProductResponse[];
  onClose: () => void;
}

export function CheckoutDetailsModal({ checkout, products, onClose }: CheckoutDetailsModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const calculateTotal = () => {
    return products.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Checkout Details
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Checkout ID: #{checkout.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Information
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Name:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                      {checkout.firstName} {checkout.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {checkout.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {checkout.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-gray-400" />
                    <a
                      href={`https://worldscan.org/address/${checkout.walletAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer"
                    >
                      {formatWalletAddress(checkout.walletAddress)}
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Shipping Address
                </h4>
                <div className="text-sm text-gray-900 dark:text-white space-y-1">
                  <div>{checkout.address}</div>
                  {checkout.apartment && <div>{checkout.apartment}</div>}
                  <div>{checkout.city}, {checkout.postcode}</div>
                  <div className="font-medium">{checkout.country}</div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Order Timeline
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Created:</span>
                    <span className="ml-2 text-sm text-gray-900 dark:text-white">
                      {formatDate(checkout.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Updated:</span>
                    <span className="ml-2 text-sm text-gray-900 dark:text-white">
                      {formatDate(checkout.updatedAt)}
                    </span>
                  </div>
                  {checkout.transactionHash && (
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Transaction Hash:</span>
                      <span className="ml-2 text-sm font-mono text-gray-900 dark:text-white break-all">
                        {checkout.transactionHash}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Ordered Products ({products.length})
                </h4>
                <div className="space-y-3">
                  {products.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No products found for this checkout.
                    </p>
                  ) : (
                    products.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.product.name}
                          </h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.product.category} • {item.product.material}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Collection: {item.product.collection?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.quantity} × {item.product.price.toFixed(2)} WLD
                          </div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {(item.quantity * item.product.price).toFixed(2)} WLD
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Order Summary */}
              {products.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Order Summary
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Subtotal:</span>
                      <span className="text-gray-900 dark:text-white">
                        {calculateTotal().toFixed(2)} WLD
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                      <div className="flex justify-between text-base font-medium">
                        <span className="text-gray-900 dark:text-white">Total:</span>
                        <span className="text-gray-900 dark:text-white">
                          {(calculateTotal()).toFixed(2)} WLD
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Raw Data (for debugging) */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Raw Checkout Data
                </h4>
                <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-32 bg-white dark:bg-gray-800 p-2 rounded border">
                  {JSON.stringify(checkout, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
