import express from "express";
import { indexGet } from "../controllers/index-controller";

var router = express.Router();

router.get("/", indexGet);

export default router;
