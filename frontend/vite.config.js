import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/socios": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },

      "/telefonos": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },

      "/planes": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },

      "/socio-planes": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },

      "/cuotas": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },

      "/cuota-planes": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },

      "/pagos": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});