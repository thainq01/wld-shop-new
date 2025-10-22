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

  const markAsSeen = useCallback(async (notificationId: number) => {
    try {
      await notificationsApi.markAsSeen(notificationId, walletAddress!);
      // Update the local state to mark as seen
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, seen: true } : n)
      );
    } catch (err) {
      console.error("Failed to mark notification as seen:", err);
    }
  }, [walletAddress]);

  const markAllAsSeen = useCallback(async () => {
    try {
      await notificationsApi.markAllAsSeen(walletAddress!);
      // Update all notifications to seen in local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, seen: true }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as seen:", err);
    }
  }, [walletAddress]);

  return {
    notifications,
    loading,
    error,
    refetch,
    markAsSeen,
    markAllAsSeen,
    unreadCount: notifications?.filter(n => !n.seen).length || 0,
  };
}
