import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// Plugin to copy _redirects from public to dist
function copyRedirects() {
  return {
    name: "copy-redirects",
    closeBundle() {
      const src = path.resolve("public/_redirects");
      const dest = path.resolve("dist/_redirects");
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log("✅ Copied _redirects to dist/");
      } else {
        console.warn("⚠️  _redirects file not found in public/");
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    commonjsOptions: {
      include: ["tailwind.config.js", "node_modules/**"],
    },
  },
  optimizeDeps: {
    include: ["tailwind-config"],
  },
  plugins: [react(), copyRedirects()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "tailwind-config": fileURLToPath(
        new URL("./tailwind.config.js", import.meta.url)
      ),
    },
  },
});