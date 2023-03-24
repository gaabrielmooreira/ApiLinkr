import { Router } from "express";
import { authValidate } from "../middlewares/authValidate.js";
import { createComment, getComments } from "../controllers/comments.controller.js";

const commentsRouter = Router();

commentsRouter.post("/create-comment", authValidate, createComment);
commentsRouter.get("/get-comments/:post", getComments);

export default commentsRouter;