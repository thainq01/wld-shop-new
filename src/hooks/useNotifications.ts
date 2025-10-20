import { useState, useEffect, useCallback } from "react";
import { notificationsApi } from "../utils/api";
import { Notification } from "../types";

export function useNotifications(walletAddress: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!walletAddress) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await notificationsApi.getByWalletAddress(walletAddress);
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch notifications"
      );
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const refetch = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    refetch,
    unreadCount: notifications?.length || 0, // You can add logic to track read/unread status
  };
}
