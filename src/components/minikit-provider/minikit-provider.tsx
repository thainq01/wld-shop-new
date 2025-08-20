import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect } from "react";
import { CONSTANT } from "../../store/constants";
import { useAutoLogin } from "../../store/authStore";

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install(CONSTANT.APP_ID);

    console.log("Is MiniKit installed correctly? ", MiniKit.isInstalled(true));
  }, []);

  useAutoLogin();

  return <>{children}</>;
}
