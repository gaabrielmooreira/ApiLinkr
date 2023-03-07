import { Router } from "express";
import { signUp } from "../controllers/users.controller.js";
import { schemaValidate } from "../middlewares/schemaValidator.js";
import { userSchema } from "../schemas/userSchema.js";


const userRouter = Router();

userRouter.post("/signup",schemaValidate(userSchema), signUp)

export default userRouter