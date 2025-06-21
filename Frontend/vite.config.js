import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          "react-vendor": ["react", "react-dom"],
          "motion-vendor": ["framer-motion"],
          "ui-vendor": ["@mui/material", "@emotion/react", "@emotion/styled"],
          "router-vendor": ["react-router-dom"],
          "icons-vendor": ["react-icons"],
        },
      },
    },
    // Enable minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion", "react-router-dom"],
  },
  server: {
    hmr: {
      overlay: false, // Disable error overlay for better dev performance
    },
  },
});
