import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  root: "./src/renderer",
  plugins: [react()],
  publicDir: "../ui/public",
  build:{
    outDir:"../../build/renderer"
  },
  base: "./",
});
