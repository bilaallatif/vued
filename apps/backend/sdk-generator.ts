import { createClient, defaultPlugins } from "@hey-api/openapi-ts";

createClient({
  input: "build/swagger.json",
  output: "../../packages/sdk/api",
  plugins: [
    ...defaultPlugins,
    "@hey-api/typescript",
    "@hey-api/client-fetch",
    { name: "@hey-api/sdk", asClass: true },
  ],
});
