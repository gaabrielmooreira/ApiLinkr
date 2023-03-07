import { Router } from "express";
import getTrends from "../controllers/trends.controller.js";

const trendsRouter = Router();

trendsRouter.get("/trends",getTrends)

export default trendsRouter;