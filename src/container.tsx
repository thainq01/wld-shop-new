/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useEffect } from "react";
import { useAuthWorld } from "./store/authStore";
import Loading from "./pages/loading";
// import ReactGA from "react-ga4";

// ReactGA.initialize("G-D2M0P7D0B8");

export function Container({ children }: { children: ReactNode }) {
  const { address } = useAuthWorld();

  useEffect(() => {
    function listen(event: any) {
      const target = event.target.closest(
        "div[data-action],a[data-action],button[data-action],li[data-action]"
      );

      if (!target) {
        return;
      }

      const action = target.dataset.action;
      if (!action) {
        return;
      }
      console.debug("action", action);
      //   ReactGA.event({
      //     category: "action",
      //     action: action,
      //   });
    }

    document.addEventListener("click", listen);

    return () => document.removeEventListener("click", listen);
  }, []);

  if (!address) {
    return <Loading />;
  }

  return children;
}
