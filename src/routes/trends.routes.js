import { Router } from "express";
import getTrends from "../controllers/trends.controller.js";
import { authValidate } from "../middlewares/authValidate.js";

const trendsRouter = Router();

trendsRouter.get("/trends",authValidate,getTrends)

export default trendsRouter;