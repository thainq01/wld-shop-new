import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { diagnosticPaymentService } from "./utils/paymentService.ts";

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
