import { MiniKit } from "@worldcoin/minikit-js";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import { KEY_AUTH_WORLDAPP, useAuthWorld } from "../store/authStore";
import { ErrorMessage } from "../utils/error";
import { usersApi } from "../utils/api";

const WEEKEND_MILISECOND = 7 * 24 * 60 * 60 * 1000;
const DAY_MILISECOND = 24 * 60 * 60 * 1000;

export default function Loading() {
  const [loading, setLoading] = useState(false);
  const [setUserInfo] = useAuthWorld(
    useShallow((state) => [state.setUserInfo])
  );
  const { t } = useTranslation();

  const login = useCallback(async () => {
    try {
      if (!MiniKit.isInstalled()) {
        console.log("Minikit not install");
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

      setUserInfo({
        address: data.walletAddress,
        profile_picture_url: data.profilePictureUrl ?? "",
        username: data.username || "Unknown",
      });

      const formSubmit = {
        walletAddress: data.walletAddress,
        username: data.username || "Unknown",
        profilePictureUrl: data.profilePictureUrl ?? null,
      };

      await usersApi.createOrUpdate(formSubmit);

      localStorage.setItem(KEY_AUTH_WORLDAPP, data.walletAddress);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }, [setUserInfo]);

  useEffect(() => {
    login();
  }, [login]);

  return (
    <div className="h-screen splash overscroll-none flex flex-col-reverse py-8 px-4">
      <button
        data-action="walletAuth"
        disabled={loading}
        onClick={login}
        className="text-base text-background font-medium h-14 px-4 rounded-full bg-primary w-full disabled:opacity-50"
      >
        {t("Sign in")}
      </button>
    </div>
  );
}
