import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Адрес вашего Go-бэкенда
        changeOrigin: true,
      },
      // Прокси для Minio
      "/images": {
        target: "http://localhost:9000",
        changeOrigin: true,
      },
    },
    port: 3000,
    host: true, // Обязательно для Docker
  },
  plugins: [react()],
});
