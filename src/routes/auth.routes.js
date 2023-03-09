import { Router } from "express";
import {signIn, signOut} from "../controllers/auth.controller.js";
import { authValidate } from "../middlewares/authValidate.js";
import { schemaValidate } from "../middlewares/schemaValidator.js";
import { loginSchema } from "../schemas/loginSchema.js";

const authRouter = Router();

authRouter.post("/signin",schemaValidate(loginSchema), signIn)
authRouter.delete("/signout",authValidate, signOut)

export default authRouter;