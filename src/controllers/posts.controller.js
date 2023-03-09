import { insertPost, deleteLikePostInDb, deletePostInDb, 
    getLikeFromDb, insertLikePostInDb, updatePostInDb, 
    getRepositoryPostsByHashtag, getPostById, getPostsFromDb, getPostsByUser,
    getHashtag, insertHashtag, insertHashPost } from "../repositories/posts.repository.js";

export async function createPost(req, res) {

    const data = req.body;
    const idUser = res.locals.user;
    const separator = data.description.split("#")

    const separatorHashtags = []
    for (let i = 1; i < separator.length; i++) {
        separatorHashtags.push(separator[i].replaceAll(" ", ""));
    }

    try {
        const idPost = await insertPost(idUser, data.description, data.link);

        for (let i = 0; i < separatorHashtags.length; i++) {
            const hashtagExists = await getHashtag(separatorHashtags[i]);
            if (hashtagExists.rowCount) {
                await insertHashPost(idPost.rows[0].id, hashtagExists.rows[0].id);
            }
            else{
                const idHashtag = await insertHashtag(separatorHashtags[i]);
                await insertHashPost(idPost.rows[0].id, idHashtag.rows[0].id);
            }
        }

        return res.status(201).send("post created");

    } catch (error) {
        return res.status(500).send(error.message);
    }
}



export async function getPosts(req, res) {
    const idUser = res.locals.user;
    try {
        const posts = await getPostsFromDb(idUser);
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
    const postDescription = req.body.postDescription;
    try {
        const post = await getPostById(idPost);
        if (post.rowCount === 0) return res.sendStatus(404);
        if (post.rows[0].user_id !== idUser) return res.status(401).send("you don't have permission for update this post.");
        await updatePostInDb(idPost, postDescription);
        return res.status(200).send("post updated successfully.")
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function getPostsByHashtag(req, res) {
    const { hashtag } = req.params;
    const idUser = res.locals.user;
    try {
        const { rowCount, rows: data } = await getRepositoryPostsByHashtag(hashtag,idUser)
        if (!rowCount) return res.sendStatus(404)
        else return res.send(data)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

export async function getPostsFromUser(req, res) {
    const { id } = req.params;
    const idUser = res.locals.user;

    try {
        const userPosts = await getPostsByUser(idUser, id)
        return res.status(201).send(userPosts.rows)

    } catch (err) {
        return res.status(500).send(err.message);
    }
}
