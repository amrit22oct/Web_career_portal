import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../backend/client", // ✅ this matches server code
    emptyOutDir: true,
  },
});
