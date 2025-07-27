import express from "express";
import logger from "morgan";
import { RegisterRoutes } from "../build/routes";

import {
  missingRouteErrorHandler,
  validationErrorHandler,
} from "./middleware/error-handling";

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

RegisterRoutes(app);

// error handling
app.use("/{*splat}", missingRouteErrorHandler);
app.use(validationErrorHandler);

export default app;
