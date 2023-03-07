import { deleteLikePostInDb, deletePostInDb, getLikeFromDb, getPostFromDb, insertLikePostInDb, updatePostInDb, getRepositoryPostsByHashtag } from "../repositories/posts.repository.js";

export async function likePost(req, res) {
    const idPost = req.params.idPost;
    const idUser = res.locals.idUser;
    try {
        const like = await getLikeFromDb(idUser, idPost);
        if (like.rowsCount === 0) {
            await insertLikePostInDb(idUser, idPost);
            return res.sendStatus(201).send("like created succesfully.");
        } else {
            await deleteLikePostInDb(idUser, idPost);
            return res.status(200).send("like deleted successfully.");
        }
    } catch (err) {
        return res.status(500).send(err);
    }
}

export async function deletePost(req, res) {
    const idPost = req.params.idPost;
    const idUser = res.locals.idUser;
    try {
        const post = await getPostFromDb(idPost);
        if (post.rowsCount === 0) return res.sendStatus(404);
        if (post.rows[0].userId !== idUser) return res.status(401).send("you don't have permission for delete this post.");
        await deletePostInDb(idPost);
        return res.status(200).send("post deleted successfully.");
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function updatePost(req, res) {
    const idPost = req.params.idPost;
    const idUser = req.locals.idUser;
    const newText = req.body.text;
    try {
        const post = await getPostFromDb(idPost);
        if (post.rowsCount === 0) return res.sendStatus(404);
        if (post.rows[0].userId !== idUser) return res.status(401).send("you don't have permission for update this post.");
        await updatePostInDb(idPost, newText);
        return res.status(200).send("post updated successfully.")
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function getPostsByHashtag(req,res) {
    const {hashtag} = req.params
    try {
        const {rowCount, rows: data} = await getRepositoryPostsByHashtag(hashtag)
        if (!rowCount) return res.sendStatus(404)
        else return res.send(data)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}