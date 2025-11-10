import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const REPO_NAME = "shareholder-app-react"; // Имя репозитория
const BASE_PATH = `/${REPO_NAME}`; // /SergeyBarshin/

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
    host: true,
  },

  base: BASE_PATH,

  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true, // Включаем для тестирования в dev-режиме
      },
      base: BASE_PATH,
      manifest: {
        name: "Shareholder App",
        short_name: "Shareholder",
        start_url: BASE_PATH, // Указываем базовый путь
        display: "standalone", // Для установки на телефон
        background_color: "#f7f8fa",
        theme_color: "#ef3124", // Фирменный цвет
        orientation: "portrait-primary",
        icons: [
          // Добавьте реальные иконки в папку public
          {
            src: "logo-192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "logo-512.png",
            type: "image/png",
            sizes: "512x512",
          },
          {
            src: "logo-512.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
