import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}", "next.config.test.ts"],
    maxWorkers: 1,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      include: [
        "next.config.ts",
        "src/app/**/*.{ts,tsx}",
        "src/components/ui/**/*.{ts,tsx}",
        "src/config/**/*.ts",
        "src/constants/**/*.ts",
        "src/features/auth/**/*.{ts,tsx}",
        "src/features/business-settings/**/*.{ts,tsx}",
        "src/features/foundation/**/*.{ts,tsx}",
        "src/lib/**/*.ts",
        "src/types/**/*.ts",
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
