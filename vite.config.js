import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost/ironspangle_api/user/login.php",
    },
  },
  plugins: [react()],
});
