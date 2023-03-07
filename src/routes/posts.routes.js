import { Router } from "express";
import { getPostsByHashtag, likePost } from "../controllers/posts.controller.js";

const postsRouter = Router();

postsRouter.post("/posts/:idPost/like", likePost);
postsRouter.get("/hashtag/:hashtag",getPostsByHashtag)

export default postsRouter;