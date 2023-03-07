import { Router } from "express";
import { likePost } from "../controllers/posts.controller.js";

const postsRouter = Router();

postsRouter.post("/posts/:idPost/like", likePost);

export default postsRouter;