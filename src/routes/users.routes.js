import { Router } from "express";
import { searchUser, signUp } from "../controllers/users.controller.js";
import { authValidate } from "../middlewares/authValidate.js";
import { schemaValidate } from "../middlewares/schemaValidator.js";
import { userSchema } from "../schemas/userSchema.js";


const userRouter = Router();

userRouter.post("/signup",schemaValidate(userSchema), signUp)
userRouter.get("/search/user/:string",authValidate,searchUser)

export default userRouter