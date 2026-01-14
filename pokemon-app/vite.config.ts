import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgrPlugin()],

  resolve: {
    alias: {
      // Sets the '@' alias to resolve to the '/src' directory
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
