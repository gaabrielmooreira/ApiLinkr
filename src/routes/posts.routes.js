import { Router } from "express";
import { createPost, deletePost, getNewPosts, getPosts, getPostsByHashtag, getPostsFromUser, toggleLike, updatePost } from "../controllers/posts.controller.js";
import { postSchema } from "../schemas/postSchema.js";
import { schemaValidate } from "../middlewares/schemaValidator.js";
import { authValidate } from "../middlewares/authValidate.js";

const postsRouter = Router();

postsRouter.post("/create-post", schemaValidate(postSchema), authValidate, createPost);
postsRouter.post("/posts/:idPost/like", authValidate, toggleLike);
postsRouter.get("/posts", authValidate, getPosts)
postsRouter.get("/posts/since/:dateParam", authValidate, getNewPosts);
postsRouter.get("/hashtag/:hashtag", authValidate, getPostsByHashtag);
postsRouter.get("/user/:id", authValidate, getPostsFromUser);
postsRouter.put("/posts/:idPost", authValidate, updatePost);
postsRouter.delete("/posts/:idPost", authValidate, deletePost);

export default postsRouter;