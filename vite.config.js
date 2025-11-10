import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
  return {
    base: command === "serve" ? "/" : "/spa/",
    build: {
      outDir: "dist",
      assetsDir: "assets",
    },
    server: {
      port: 5173,
      open: true,
    },
  };
});
