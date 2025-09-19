import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize Eruda for debugging (development and when explicitly enabled)
if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_ERUDA === "true") {
  import("eruda").then((eruda) => {
    eruda.default.init();
    console.log("🔧 Eruda debugging console initialized");
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
