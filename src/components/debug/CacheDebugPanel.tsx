import { useState, useEffect } from "react";
import { useCollectionStore } from "../../store/collectionStore";
import { useExploreCache } from "../../hooks/useExploreCache";

/**
 * Debug panel for monitoring cache performance
 * Only shown in development mode
 */
export function CacheDebugPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { getCacheStats } = useExploreCache();
  const {
    cacheHits,
    cacheMisses,
    totalCachedProducts,
    getCacheStatus,
  } = useCollectionStore();

  const [stats, setStats] = useState(() => getCacheStats());
  const [cacheStatus, setCacheStatus] = useState(() => getCacheStatus());

  // Auto-refresh stats
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setStats(getCacheStats());
      setCacheStatus(getCacheStatus());
    }, 2000);

    return () => clearInterval(interval);
  }, [autoRefresh, getCacheStats, getCacheStatus]);

  // Don't render in production
  if (import.meta.env.PROD) return null;

  const hitRate = cacheHits + cacheMisses > 0 
    ? ((cacheHits / (cacheHits + cacheMisses)) * 100).toFixed(1)
    : '0';

  const formatTime = (timestamp: number) => {
    if (!timestamp) return 'Never';
    const ago = Date.now() - timestamp;
    if (ago < 60000) return `${Math.floor(ago / 1000)}s ago`;
    if (ago < 3600000) return `${Math.floor(ago / 60000)}m ago`;
    return `${Math.floor(ago / 3600000)}h ago`;
  };

  const getStatusColor = (lastFetched: number) => {
    const age = Date.now() - lastFetched;
    if (age < 2 * 60 * 1000) return 'text-green-600'; // Fresh (< 2min)
    if (age < 4 * 60 * 1000) return 'text-yellow-600'; // Stale (< 4min)
    return 'text-red-600'; // Expired (> 4min)
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Toggle Cache Debug Panel"
      >
        📊
      </button>

      {/* Debug Panel */}
      {isVisible && (
        <div className="fixed top-4 right-4 z-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl p-4 max-w-md max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Cache Debug
            </h3>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-3 h-3"
                />
                Auto
              </label>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Overall Performance
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-300">Hit Rate:</span>
                <span className={`ml-1 font-mono ${
                  parseFloat(hitRate) > 80 ? 'text-green-600' : 
                  parseFloat(hitRate) > 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {hitRate}%
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-300">Products:</span>
                <span className="ml-1 font-mono text-blue-600">
                  {totalCachedProducts}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-300">Hits:</span>
                <span className="ml-1 font-mono text-green-600">{cacheHits}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-300">Misses:</span>
                <span className="ml-1 font-mono text-red-600">{cacheMisses}</span>
              </div>
            </div>
          </div>

          {/* Collection Status */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Collection Cache Status
            </h4>
            <div className="space-y-2 text-sm">
              {Object.entries(cacheStatus).map(([slug, status]) => (
                <div key={slug} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 truncate">
                    {slug}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-blue-600">
                      {status.productCount}
                    </span>
                    <span className={`font-mono text-xs ${getStatusColor(status.lastFetched)}`}>
                      {formatTime(status.lastFetched)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cache Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setStats(getCacheStats());
                setCacheStatus(getCacheStatus());
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                useCollectionStore.getState().refreshAllData();
                setTimeout(() => {
                  setStats(getCacheStats());
                  setCacheStatus(getCacheStatus());
                }, 1000);
              }}
              className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
            >
              Clear Cache
            </button>
          </div>

          {/* Legend */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Fresh (&lt;2m)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
                  Stale (&lt;4m)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  Expired (&gt;4m)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
