import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@stripe/stripe-js": require.resolve("@stripe/stripe-js"),
    },
  },
  build: {
    rollupOptions: {
      external: ["@stripe/stripe-js"],
    },
  },
});
