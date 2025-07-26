import express from "express";
import logger from "morgan";
import createError from "http-errors";
import { RegisterRoutes } from "../build/routes";

import { errorHandler } from "./middleware/error-handling";

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

RegisterRoutes(app);

// catch 404 and forward to the error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// error handler
app.use(errorHandler);

export default app;
