import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "81ce3e98883a.ngrok-free.app",
    ],
    proxy: {
      // Proxy requests to HoldStation CMS API
      "/api/cms": {
        target: "https://cms.holdstation.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cms/, ""),
        secure: true,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Vite-Dev-Server)",
        },
      },
    },
  },
});
