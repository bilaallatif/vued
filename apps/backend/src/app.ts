import express from "express";
import logger from "morgan";
import createError from "http-errors";

import indexRouter from "./routes/index";
import { errorHandler } from "./middleware/error-handling";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

// catch 404 and forward to the error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(errorHandler);

export default app;
