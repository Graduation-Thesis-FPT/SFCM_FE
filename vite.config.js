import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "classic",
      babel: {
        plugins: [["@babel/plugin-transform-react-jsx", { runtime: "automatic" }]]
      }
    })
  ],
  server: {
    port: 2024
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // "react/jsx-runtime": "react/jsx-runtime.js"
    }
  }
});
