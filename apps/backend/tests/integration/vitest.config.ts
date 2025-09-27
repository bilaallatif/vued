import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    name: "integration",
    setupFiles: ["./setup.ts"],
  },
});
