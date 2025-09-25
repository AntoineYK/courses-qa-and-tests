// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: "v8", // utilise V8 pour la couverture
      reporter: ["text", "html", "json"], // text en console, html dans coverage/, lcov pour CI
      exclude: ["node_modules/", "coverage/", "**/*.spec.*", "vitest.config.*"],
    },
  },
});
