import { Router } from "express";
import { getPostsByHashtag, likePost } from "../controllers/posts.controller.js";
import {postSchema} from "../schemas/postSchema.js";
import {schemaValidate} from "../middlewares/schemaValidator.js";
import { authValidate } from "../middlewares/authValidate.js";
import { insertPost } from "../repositories/posts.repository.js";

const postsRouter = Router();

postsRouter.post("/create-post", schemaValidate(postSchema), authValidate, insertPost);
postsRouter.post("/posts/:idPost/like", likePost);
postsRouter.get("/hashtag/:hashtag",getPostsByHashtag)

export default postsRouter;