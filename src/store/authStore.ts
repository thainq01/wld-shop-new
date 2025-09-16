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
  const [setUserInfo, username, address, syncUserToBackend, user, setAddress] =
    useAuthWorld(
      useShallow((state) => [
        state.setUserInfo,
        state.username,
        state.address,
        state.syncUserToBackend,
        state.user,
        state.setAddress,
      ])
    );

  console.log("🔄 useAutoLogin hook initialized with state:", {
    username,
    address,
    hasUser: !!user,
  });

  useEffect(() => {
    async function autoLogin() {
      try {
        // Check if user is already logged in
        const storedAddress = localStorage.getItem(KEY_AUTH_WORLDAPP);
        if (storedAddress && address === storedAddress) {
          console.log("User already logged in with address:", storedAddress);
          return;
        }

        // If no stored address, try to auto-login
        if (!storedAddress) {
          console.log("No stored address, attempting auto-login...");

          if (!MiniKit.isInstalled()) {
            console.log("MiniKit not installed, skipping auto-login");
            return;
          }

          const nonce = crypto.randomUUID().replace(/-/g, "");
          const WEEKEND_MILISECOND = 7 * 24 * 60 * 60 * 1000;
          const DAY_MILISECOND = 24 * 60 * 60 * 1000;

          const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
            nonce: nonce,
            requestId: "0",
            expirationTime: new Date(new Date().getTime() + WEEKEND_MILISECOND),
            notBefore: new Date(new Date().getTime() - DAY_MILISECOND),
            statement: "",
          });

          if (finalPayload.status === "success") {
            const walletAddress = finalPayload.address;
            console.log(
              "Auto-login successful, wallet address:",
              walletAddress
            );

            // Set the address first
            setAddress(walletAddress);
            localStorage.setItem(KEY_AUTH_WORLDAPP, walletAddress);

            // Then fetch user info
            const data = await MiniKit.getUserInfo(walletAddress);
            if (data) {
              const userInfo = {
                address: data.walletAddress || walletAddress,
                profile_picture_url: data.profilePictureUrl ?? "",
                username: data.username || "Unknown",
              };

              console.log("Setting user info from auto-login:", userInfo);
              setUserInfo(userInfo);
            }
          } else {
            console.log("Auto-login failed:", finalPayload.error_code);
          }
        } else {
          // We have a stored address but it's different from current address
          console.log(
            "Stored address found, fetching user info:",
            storedAddress
          );
          setAddress(storedAddress);

          const data = await MiniKit.getUserInfo(storedAddress);
          if (data) {
            const userInfo = {
              address: data.walletAddress || storedAddress,
              profile_picture_url: data.profilePictureUrl ?? "",
              username: data.username || "Unknown",
            };

            console.log("Setting user info from stored address:", userInfo);
            setUserInfo(userInfo);
          }
        }
      } catch (error) {
        console.error("Auto-login failed:", error);
      }
    }

    autoLogin();
  }, [setUserInfo, setAddress, address, username]);

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
