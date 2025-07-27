import { createClient } from "@hey-api/openapi-ts";

createClient({
  input: "dist/swagger.json",
  output: "../../packages/SDK/api",
});
