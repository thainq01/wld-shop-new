import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { diagnosticPaymentService } from "./utils/paymentService.ts";

// Initialize Eruda for mobile debugging
if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_ERUDA === "true") {
  import("eruda").then((eruda) => {
    eruda.default.init();
    console.log("🔍 Eruda mobile debugger initialized");
  });
}

// Make diagnostic function available globally for debugging
if (typeof window !== "undefined") {
  (window as any).diagnosticPaymentService = diagnosticPaymentService;
  console.log(
    "🔧 Diagnostic function available: window.diagnosticPaymentService()"
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
