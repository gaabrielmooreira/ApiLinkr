import { Router } from "express";
import { createPost, createRePost, deletePost,getPostsByHashtag,
         getPostsFromUser, getRePostCount, toggleLike,
         updatePost, getRePostsAndPosts, getNewRePostsAndPosts } from "../controllers/posts.controller.js";
import { postSchema } from "../schemas/postSchema.js";
import { schemaValidate } from "../middlewares/schemaValidator.js";
import { authValidate } from "../middlewares/authValidate.js";

const postsRouter = Router();

postsRouter.post("/create-post", schemaValidate(postSchema), authValidate, createPost);
postsRouter.post("/posts/:idPost/like", authValidate, toggleLike);
postsRouter.post("/re-post", authValidate, createRePost );
postsRouter.get("/posts-reposts",authValidate, getRePostsAndPosts)
postsRouter.get("/posts-reposts/since/:dateParam", authValidate, getNewRePostsAndPosts);
postsRouter.get("/hashtag/:hashtag", authValidate, getPostsByHashtag);
postsRouter.get("/user/:id", authValidate, getPostsFromUser);
postsRouter.get("/re-post/:id", getRePostCount)
postsRouter.put("/posts/:idPost", authValidate, updatePost);
postsRouter.delete("/posts/:idPost", authValidate, deletePost);

export default postsRouter;