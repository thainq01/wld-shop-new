import { useEffect, useState } from "react";
import { Package, Tag, TrendingUp, Users, ShoppingCart } from "lucide-react";
import {
  collectionsApi,
  productsApi,
  usersApi,
  checkoutApi,
} from "../../../utils/api";
import { Collection, Product, User } from "../../../types";

interface DashboardStats {
  totalCollections: number;
  activeCollections: number;
  totalProducts: number;
  featuredProducts: number;
  totalUsers: number;
  usersWithProfiles: number;
  totalCheckouts: number;
  todayCheckouts: number;
}

export function CMSDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCollections: 0,
    activeCollections: 0,
    totalProducts: 0,
    featuredProducts: 0,
    totalUsers: 0,
    usersWithProfiles: 0,
    totalCheckouts: 0,
    todayCheckouts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentCollections, setRecentCollections] = useState<Collection[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch collections, products, users, and checkouts
      const [collections, products, users, checkoutsResponse] =
        await Promise.all([
          collectionsApi.getAll(),
          productsApi.getAll({ limit: 50 }),
          usersApi.getAll().catch(() => []), // Gracefully handle if users API fails
          checkoutApi
            .getAll({ page: 0, size: 100 })
            .catch(() => ({ content: [], totalElements: 0 })), // Gracefully handle if checkouts API fails
        ]);

      console.log("Dashboard checkout response:", checkoutsResponse);

      // Handle different response structures
      let checkouts: any[] = [];
      let totalCheckouts = 0;

      if (Array.isArray(checkoutsResponse)) {
        checkouts = checkoutsResponse;
        totalCheckouts = checkoutsResponse.length;
      } else if (checkoutsResponse && typeof checkoutsResponse === "object") {
        const responseAny = checkoutsResponse as any;
        checkouts = responseAny.content || responseAny.data || [];
        totalCheckouts =
          responseAny.totalElements || responseAny.total || checkouts.length;
      }

      const today = new Date().toDateString();
      const todayCheckouts = checkouts?.filter(
        (c) => new Date(c.createdAt).toDateString() === today
      ).length;

      // Calculate stats
      setStats({
        totalCollections: collections.length,
        activeCollections: collections.filter((c) => c.isActive).length,
        totalProducts: products.length,
        featuredProducts: products.filter((p) => p.featured).length,
        totalUsers: users.length,
        usersWithProfiles: users.filter((u) => u.profilePictureUrl).length,
        totalCheckouts: totalCheckouts,
        todayCheckouts: todayCheckouts,
      });

      // Recent data (last 5)
      setRecentCollections(collections.slice(-5).reverse());
      setRecentProducts(products.slice(-5).reverse());
      setRecentUsers(users.slice(-5).reverse());
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      name: "Total Collections",
      stat: stats.totalCollections,
      icon: Tag,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      name: "Active Collections",
      stat: stats.activeCollections,
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      name: "Total Products",
      stat: stats.totalProducts,
      icon: Package,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      name: "Featured Products",
      stat: stats.featuredProducts,
      icon: TrendingUp,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      name: "Total Users",
      stat: stats.totalUsers,
      icon: Users,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      name: "Total Checkouts",
      stat: stats.totalCheckouts,
      icon: ShoppingCart,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      name: "Today's Orders",
      stat: stats.todayCheckouts,
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Welcome to World Shop CMS
          </p>
        </div>

        {/* Loading skeleton */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg animate-pulse"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Welcome to World Shop CMS - Manage your store content
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        {statsCards.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-md ${item.bgColor}`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {item.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {item.stat}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Recent Collections */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Recent Collections
              </h3>
              <Tag className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="space-y-3">
              {recentCollections.length > 0 ? (
                recentCollections.map((collection) => (
                  <div
                    key={collection.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {collection.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {collection.slug}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        collection.isActive
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {collection.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No collections found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Recent Products
              </h3>
              <Package className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="space-y-3">
              {recentProducts.length > 0 ? (
                recentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ${product.price} • {product.collection?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.featured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                          ★ Featured
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.inStock !== "Out of Stock"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                        }`}
                      >
                        {product.inStock}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No products found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Recent Users
              </h3>
              <Users className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="space-y-3">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {user.profilePictureUrl ? (
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={user.profilePictureUrl}
                            alt={user.username}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {user.walletAddress.slice(0, 6)}...
                          {user.walletAddress.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No users found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
