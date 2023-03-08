import { Router } from "express";
import { createPost, deletePost, getPosts, getPostsByHashtag, toggleLike, updatePost } from "../controllers/posts.controller.js";
import { postSchema } from "../schemas/postSchema.js";
import { schemaValidate } from "../middlewares/schemaValidator.js";
import { authValidate } from "../middlewares/authValidate.js";

const postsRouter = Router();

postsRouter.post("/create-post", schemaValidate(postSchema), authValidate, createPost);
postsRouter.post("/posts/:idPost/like", authValidate, toggleLike);
postsRouter.get("/posts", authValidate, getPosts)
postsRouter.get("/hashtag/:hashtag", getPostsByHashtag);
postsRouter.put("/post/:idPost", authValidate, updatePost);
postsRouter.delete("/posts/:idPost", authValidate, deletePost);

export default postsRouter;