import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { mergeAPIError } from "../utils/error";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { usersApi } from "../utils/api";
import type { User } from "../types";

interface AuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,

      login: (username: string, password: string) => {
        const correctUsername = import.meta.env.VITE_CMS_USERNAME || "admin";
        const correctPassword = import.meta.env.VITE_CMS_PASSWORD || "password";

        if (username === correctUsername && password === correctPassword) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false });
      },

      checkAuth: () => {
        return get().isAuthenticated;
      },
    }),
    {
      name: "cms-auth-storage", // unique name for localStorage key
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);

export const KEY_AUTH_WORLDAPP = "@app/wallet/user";

interface AuthWorldStore {
  address: string;
  username: string;
  profile_picture_url?: string | null;
  user?: User | null;
  isUserSyncing: boolean;
}

type Actions = {
  setAddress: (address: string) => void;
  setUserInfo: (info: {
    address: string;
    username: string;
    profile_picture_url?: string | null;
  }) => void;
  setUser: (user: User | null) => void;
  setUserSyncing: (syncing: boolean) => void;
  syncUserToBackend: () => Promise<void>;
  forceSyncUser: () => Promise<void>;
};

export const useAuthWorld = create<AuthWorldStore & Actions>()(
  immer((set, get) => ({
    address: localStorage.getItem(KEY_AUTH_WORLDAPP) || "",
    username: "",
    profile_picture_url: "",
    user: null,
    isUserSyncing: false,

    setAddress: (address) =>
      set((state) => {
        state.address = address;
      }),

    setUserInfo: (info) => {
      set({ ...info });
    },

    setUser: (user) =>
      set((state) => {
        state.user = user;
      }),

    setUserSyncing: (syncing) =>
      set((state) => {
        state.isUserSyncing = syncing;
      }),

    syncUserToBackend: async () => {
      const state = get();

      console.log("syncUserToBackend called with state:", {
        address: state.address,
        username: state.username,
        isUserSyncing: state.isUserSyncing,
        hasUser: !!state.user,
      });

      if (!state.address || !state.username) {
        console.log("Skipping sync: missing address or username");
        return;
      }

      if (state.isUserSyncing) {
        console.log("Skipping sync: already syncing");
        return;
      }

      try {
        set((state) => {
          state.isUserSyncing = true;
        });

        const userData = {
          walletAddress: state.address,
          username: state.username,
          profilePictureUrl: state.profile_picture_url || null,
        };

        console.log("Calling usersApi.createOrUpdate with:", userData);
        const user = await usersApi.createOrUpdate(userData);

        set((state) => {
          state.user = user;
          state.isUserSyncing = false;
        });

        console.log("✅ User successfully synced to backend:", user);
      } catch (error) {
        console.error("❌ Failed to sync user to backend:", error);
        set((state) => {
          state.isUserSyncing = false;
        });
        // Don't throw the error to prevent breaking the login flow
      }
    },

    forceSyncUser: async () => {
      const state = get();
      console.log("🔄 Force sync triggered with state:", {
        address: state.address,
        username: state.username,
        profile_picture_url: state.profile_picture_url,
      });

      // Reset user state to force re-sync
      set((state) => {
        state.user = null;
        state.isUserSyncing = false;
      });

      // Call sync function
      await get().syncUserToBackend();
    },
  }))
);

export interface UserResponse {
  username: string;
  address: string;
  profile_picture_url: null;
}

const QUERY = "https://usernames.worldcoin.org/api/v1/query";

export async function getUser(address: string) {
  const response = await fetch(QUERY, {
    method: "POST",
    body: JSON.stringify({
      addresses: [address],
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const msg = await response
      .json()
      .then((e) => mergeAPIError(e))
      .catch((e) => e.message ?? response.statusText);
    throw new Error(
      `Failed to get user info with status ${response.status} :${msg}`
    );
  }

  const data = await response.json();
  return data;
}

export function useAutoLogin() {
  const [setUserInfo, username, address, syncUserToBackend, user] =
    useAuthWorld(
      useShallow((state) => [
        state.setUserInfo,
        state.username,
        state.address,
        state.syncUserToBackend,
        state.user,
      ])
    );

  console.log("🔄 useAutoLogin hook initialized with state:", {
    username,
    address,
    hasUser: !!user,
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const storedAddress = localStorage.getItem(KEY_AUTH_WORLDAPP);
        if (!storedAddress) {
          return;
        }

        // Skip if we already have user info for this address
        if (username && address === storedAddress) {
          return;
        }

        console.log("Fetching user info for address:", storedAddress);
        const data = await MiniKit.getUserInfo(storedAddress);

        if (!data) {
          console.log("No user data received from MiniKit");
          return;
        }

        const userInfo = {
          address: data.walletAddress || storedAddress,
          profile_picture_url: data.profilePictureUrl ?? "",
          username: data.username || "Unknown",
        };

        console.log("Setting user info:", userInfo);
        setUserInfo(userInfo);
      } catch (error) {
        console.error("Failed to get user info from MiniKit:", error);
      }
    }

    fetchUser();
  }, [setUserInfo, address, username, syncUserToBackend]);

  // Separate effect to sync user to backend after user info is set
  useEffect(() => {
    async function syncUser() {
      if (!address || !username || user) {
        return; // Skip if no address/username or user already synced
      }

      console.log("Syncing user to backend:", { address, username });
      try {
        await syncUserToBackend();
      } catch (error) {
        console.error("Failed to sync user to backend:", error);
      }
    }

    syncUser();
  }, [address, username, syncUserToBackend, user]);
}
