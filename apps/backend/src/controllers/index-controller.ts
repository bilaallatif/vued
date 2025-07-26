import { RequestHandler } from "express";
import User from "../types/User";

export const indexGet: RequestHandler = (req, res) => {
  const test: User = { name: "test" };
  res.json(test);
};
