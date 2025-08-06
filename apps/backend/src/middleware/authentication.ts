import { RequestHandler } from "express";
import { HttpError } from "../types/exceptions";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authHandler: RequestHandler = (req, res, next) => {
  const token =
    req.headers.authorization ??
    (() => {
      throw new HttpError(401, "Authentication failed");
    })();

  try {
    // Split "Bearer <token>" to "<token>"
    const payload = jwt.verify(token.split(" ")[1], "test") as JwtPayload;
    res.locals.userId = payload.userId;
  } catch (error) {
    throw new HttpError(401, "Invalid token");
  }

  next();
};
