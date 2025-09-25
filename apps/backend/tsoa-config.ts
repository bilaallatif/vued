import {
  generateRoutes,
  generateSpec,
  ExtendedRoutesConfig,
  ExtendedSpecConfig,
} from "tsoa";
import config from "./src/config/config";

(async () => {
  const specOptions: ExtendedSpecConfig = {
    basePath: "",
    noImplicitAdditionalProperties: "throw-on-extras",
    entryFile: "src/app.ts",
    controllerPathGlobs: ["src/**/*-controller.ts"],
    specVersion: 3,
    outputDirectory: "build",
    host: `localhost:${config.port}`,
    schemes: ["http"],
  };

  const routeOptions: ExtendedRoutesConfig = {
    noImplicitAdditionalProperties: "throw-on-extras",
    entryFile: "src/app.ts",
    controllerPathGlobs: ["src/**/*-controller.ts"],
    routesDir: "build",
    iocModule: "src/ioc",
    bodyCoercion: false,
  };

  await generateSpec(specOptions);
  await generateRoutes(routeOptions);
})();
