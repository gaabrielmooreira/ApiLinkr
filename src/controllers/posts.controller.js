import { insertPost, deleteLikePostInDb, deletePostInDb, getLikeFromDb, insertLikePostInDb, updatePostInDb, getRepositoryPostsByHashtag, getPostById, getPostsFromDb } from "../repositories/posts.repository.js";

export async function createPost(req, res) {

    const data = req.body;
    const idUser = res.locals.user;
     
    
    try {
        insertPost(idUser, data);       
        return res.status(201).send("post created");

    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function getPosts(req, res) {
    const idUser = res.locals.user;
    try {
        const posts = getPostsFromDb(idUser);
        return res.send(posts.rows);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function toggleLike(req, res) {
    const idPost = req.params.idPost;
    const idUser = res.locals.user;
    try {
        const like = await getLikeFromDb(idUser, idPost);
        if (like.rowCount === 0) {
            await insertLikePostInDb(idUser, idPost);
            return res.sendStatus(201).send("like created succesfully.");
        } else {
            await deleteLikePostInDb(idUser, idPost);
            return res.status(200).send("like deleted successfully.");
        }
    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function deletePost(req, res) {
    const idPost = req.params.idPost;
    const idUser = res.locals.user;
    try {
        const post = await getPostById(idPost);
        if (post.rowCount === 0) return res.sendStatus(404);
        if (post.rows[0].user_id !== idUser) return res.status(401).send("you don't have permission for delete this post.");
        await deletePostInDb(idPost);
        return res.status(200).send("post deleted successfully.");
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function updatePost(req, res) {
    const idPost = req.params.idPost;
    const idUser = req.locals.user;
    const newText = req.body.text;
    try {
        const post = await getPostById(idPost);
        if (post.rowCount === 0) return res.sendStatus(404);
        if (post.rows[0].user_id !== idUser) return res.status(401).send("you don't have permission for update this post.");
        await updatePostInDb(idPost, newText);
        return res.status(200).send("post updated successfully.")
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function getPostsByHashtag(req, res) {
    const { hashtag } = req.params
    try {
        const { rowCount, rows: data } = await getRepositoryPostsByHashtag(hashtag)
        if (!rowCount) return res.sendStatus(404)
        else return res.send(data)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}