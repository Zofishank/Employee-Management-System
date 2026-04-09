import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress common warnings that break CI builds
        if (
          warning.code === "UNUSED_EXTERNAL_IMPORT" ||
          warning.code === "MODULE_LEVEL_DIRECTIVE"
        )
          return;
        warn(warning);
      },
    },
  },
});
