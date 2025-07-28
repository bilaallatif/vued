import { createClient } from "@hey-api/openapi-ts";

createClient({
  input: "build/swagger.json",
  output: "../../packages/SDK/api",
});
