import { Home, ShoppingBag } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartItemCount } = useCartStore();

  const isExploreActive = location.pathname === "/explore";
  const cartItemCount = getCartItemCount();

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-around py-2">
        {/* Explore Tab */}
        <button
          onClick={() => navigate("/explore")}
          className={`flex flex-col items-center gap-1 py-2 px-4 min-w-0 transition-opacity ${
            isExploreActive ? "opacity-100" : "opacity-70"
          }`}
        >
          <div className="p-2">
            <Home className="w-5 h-5 text-gray-900 dark:text-gray-100" />
          </div>
          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
            Explore
          </span>
        </button>

        {/* Bag Tab */}
        <button
          onClick={() => navigate("/bag")}
          className={`flex flex-col items-center gap-1 py-2 px-4 min-w-0 relative transition-opacity ${
            location.pathname === "/bag" ? "opacity-100" : "opacity-70"
          }`}
        >
          <div className="p-2 relative">
            <ShoppingBag className="w-5 h-5 text-gray-900 dark:text-gray-100" />
            {/* Cart count badge */}
            {cartItemCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              </div>
            )}
          </div>
          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
            Bag
          </span>
        </button>
      </div>
    </div>
  );
}
