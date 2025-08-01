import express from "express";
import logger from "morgan";
import cors from "cors";
import { RegisterRoutes } from "../build/routes";

import {
  missingRouteErrorHandler,
  validationErrorHandler,
} from "./middleware/error-handling";

const app = express();

app.use(
  cors({
    origin: "*",
  }),
);
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Ok");
});

RegisterRoutes(app);

// error handling
app.use("/{*splat}", missingRouteErrorHandler);
app.use(validationErrorHandler);

export default app;
