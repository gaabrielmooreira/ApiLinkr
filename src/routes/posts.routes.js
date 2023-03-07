import { Router } from "express";
<<<<<<< HEAD
import { likePost } from "../controllers/posts.controller.js";
import {postSchema} from "../schemas/postSchema.js";
import {schemaValidate} from "../middlewares/schemaValidator.js";
import { authValidate } from "../middlewares/authValidate.js";
import { insertPost } from "../repositories/posts.repository.js";
=======
import { getPostsByHashtag, likePost } from "../controllers/posts.controller.js";
>>>>>>> e67ba4965f7b040c253c256d367ddddefe13e186

const postsRouter = Router();

postsRouter.post("/create-post", schemaValidate(postSchema), authValidate, insertPost);
postsRouter.post("/posts/:idPost/like", likePost);
postsRouter.get("/hashtag/:hashtag",getPostsByHashtag)

export default postsRouter;