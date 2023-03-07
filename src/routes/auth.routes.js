import { Router } from "express";
import {signIn} from "../controllers/auth.controller.js";
import { schemaValidate } from "../middlewares/schemaValidator.js";
import { loginSchema } from "../schemas/loginSchema.js";

const authRouter = Router();

authRouter.post("/signin",schemaValidate(loginSchema), signIn)

export default authRouter;