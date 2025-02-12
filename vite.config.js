import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //   host: "0.0.0.0", // Allows access from local network (192.168.1.102)
  //   port: 5173, // Ensures port 5173 is used
  //   strictPort: true, // Prevents auto-changing ports
  //   cors: true, // Enables cross-origin access
  //   force: true, // Forces reloads properly
  // },
});
