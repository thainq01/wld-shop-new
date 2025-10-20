import { useNotifications } from "../../hooks/useNotifications";
import { useAuthWorld } from "../../store/authStore";
import { useShallow } from "zustand/react/shallow";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Clock } from "lucide-react";
import { BottomNavigation } from "../BottomNavigation";
import { LoginButton } from "../LoginButton";

export function NotificationsScreen() {
  const navigate = useNavigate();
  const { address } = useAuthWorld(
    useShallow((state) => ({
      address: state.address,
    }))
  );

  const { notifications, loading, error, refetch } = useNotifications(address);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      // Less than a week
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Login required state when no wallet
  if (!address) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        {/* Content centered in screen */}
        <div className="flex-1 flex items-center justify-center px-4 pb-20">
          <div className="text-center max-w-sm">
            {/* Bell icon (matching empty state style) */}
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-400 rounded-full flex items-center justify-center">
              <Bell className="w-16 h-16 text-white" />
            </div>

            {/* Login required text */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Login Required
            </h2>

            {/* Description text */}
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-12">
              Please sign in with your World ID to view notifications
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
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading notifications...
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
              <Bell className="w-16 h-16 text-red-600 dark:text-red-400" />
            </div>

            {/* Error title */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Error Loading Notifications
            </h2>

            {/* Error message */}
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-12">
              {error}
            </p>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={refetch}
                disabled={loading}
                className="w-[250px] py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Retrying..." : "Try Again"}
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
      {notifications.length === 0 ? (
        <>
          {/* Empty state - centered and styled like history empty state */}
          <div className="flex-1 flex items-center justify-center px-4 pb-20">
            <div className="text-center max-w-sm">
              {/* Bell icon */}
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-400 rounded-full flex items-center justify-center">
                <Bell className="w-16 h-16 text-white" />
              </div>

              {/* No notifications text */}
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                No notifications yet
              </h2>

              {/* Description text */}
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
                We'll notify you when there are updates about your orders
              </p>

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/explore")}
                  className="w-[250px] py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Header for notifications list */}
          <div className="px-4 pt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Notifications
              </h2>
            </div>
          </div>

          <div className="w-full mx-auto py-6 pb-10 space-y-4 px-4">
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={notification.path}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden w-full block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="p-6">
                    {/* Notification Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(notification.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notification Message */}
                    <div className="ml-13">
                      <p className="text-sm text-gray-600 dark:text-gray-400 break-words">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      <BottomNavigation />
    </div>
  );
}
