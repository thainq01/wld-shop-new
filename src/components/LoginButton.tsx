import { MiniKit } from "@worldcoin/minikit-js";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import { KEY_AUTH_WORLDAPP, useAuthWorld } from "../store/authStore";
import { ErrorMessage } from "../utils/error";
import { usersApi } from "../utils/api";
import { getUserMetadata, updateUserMetadata } from "../utils/ipInfo";

const WEEKEND_MILISECOND = 7 * 24 * 60 * 60 * 1000;
const DAY_MILISECOND = 24 * 60 * 60 * 1000;

export function LoginButton() {
  const [loading, setLoading] = useState(false);
  const [setUserInfo, setAddress] = useAuthWorld(
    useShallow((state) => [state.setUserInfo, state.setAddress])
  );
  const { t } = useTranslation();

  const login = useCallback(async () => {
    try {
      if (!MiniKit.isInstalled()) {
        console.log("MiniKit not installed");
        return;
      }
      setLoading(true);

      const nonce = crypto.randomUUID().replace(/-/g, "");

      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: nonce,
        requestId: "0",
        expirationTime: new Date(new Date().getTime() + WEEKEND_MILISECOND),
        notBefore: new Date(new Date().getTime() - DAY_MILISECOND),
        statement: "",
      });

      if (finalPayload.status !== "success") {
        if (!finalPayload.details) {
          const msg = ErrorMessage(finalPayload.error_code);
          throw new Error(msg || "Sign-in failed");
        }
        throw new Error(finalPayload.details);
      }

      const data = await MiniKit.getUserInfo(finalPayload?.address);

      if (!data) {
        throw new Error("Userinfo not found");
      }

      setAddress(data.walletAddress);
      setUserInfo({
        address: data.walletAddress,
        profile_picture_url: data.profilePictureUrl ?? "",
        username: data.username || "Unknown",
      });

      // Check if user exists and update metadata accordingly
      try {
        console.log("🔍 Checking for existing user...");
        const existingUser = await usersApi.getByWalletAddress(
          data.walletAddress
        );

        // User exists - update metadata separately
        console.log("👤 User found, updating metadata...");
        await updateUserMetadata(data.walletAddress);

        // Update other fields if needed
        const updateData = {
          username: data.username || "Unknown",
          profilePictureUrl: data.profilePictureUrl ?? null,
        };
        await usersApi.partialUpdate(existingUser.id, updateData);
      } catch (error) {
        // User doesn't exist - create new user with metadata
        console.log("🆕 User not found, creating new user with metadata...");
        const userMetadata = await getUserMetadata();

        const formSubmit = {
          walletAddress: data.walletAddress,
          username: data.username || "Unknown",
          profilePictureUrl: data.profilePictureUrl ?? null,
          userMetadata: userMetadata,
        };

        await usersApi.create(formSubmit);
      }

      localStorage.setItem(KEY_AUTH_WORLDAPP, data.walletAddress);
    } catch (error) {
      console.log("Login error:", error);
    } finally {
      setLoading(false);
    }
  }, [setUserInfo, setAddress]);

  return (
    <button
      data-action="walletAuth"
      disabled={loading}
      onClick={login}
      className={`w-[250px] py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors`}
    >
      {loading ? t("loading") : t("signIn")}
    </button>
  );
}
