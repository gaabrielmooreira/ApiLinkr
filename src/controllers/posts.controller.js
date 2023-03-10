import urlMetadata from 'url-metadata';
import {
    insertPost, deleteLikePostInDb, deletePostInDb,
    getLikeFromDb, insertLikePostInDb, updatePostInDb,
    getRepositoryPostsByHashtag, getPostById, getPostsFromDb, getPostsByUser,
    getHashtag, insertHashtag, insertHashPost, deleteHashtag
} from "../repositories/posts.repository.js";

export async function createPost(req, res) {

    const data = req.body;
    const idUser = res.locals.user;
    const separator = data.description.split(" ")

    const separatorHashtags = []
    for (let i = 0; i < separator.length; i++) {
        if (separator[i][0] === '#') separatorHashtags.push(separator[i].slice(1).trim());
    }
    let metadata
    try {
        metadata = await urlMetadata(data.link);
    } catch (error) {
        metadata = await urlMetadata("https://www.google.com")
    }
    try {
        
        const { title: post_link_title, image: post_link_image, description: post_link_description } = metadata;

        const idPost = await insertPost(idUser, data.description, data.link, post_link_title, post_link_description, post_link_image);

        for (let i = 0; i < separatorHashtags.length; i++) {
            const hashtagExists = await getHashtag(separatorHashtags[i]);
            if (hashtagExists.rowCount) {
                await insertHashPost(idPost.rows[0].id, hashtagExists.rows[0].id);
            }
            else {
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
            return res.status(201).send("like created succesfully.");
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
    const idUser = res.locals.user;
    const postDescription = req.body.postDescription;

    try {
        const post = await getPostById(idPost);
        if (post.rowCount === 0) return res.sendStatus(404);
        if (post.rows[0].user_id !== idUser) return res.status(401).send("you don't have permission for update this post.");

        const separator = postDescription.split(" ");
        const separatorHashtags = [];
        const oldHashtags = [];

        for (let i = 0; i < separator.length; i++) {
            if (separator[i][0] === '#') separatorHashtags.push(separator[i].slice(1).trim());
        }

        const getOldHashtags = () => post.rows[0].post_description.split(" ").forEach(e => {
            if (e[0] === '#') {
                oldHashtags.push(e.slice(1));
            }
        });
        getOldHashtags();

        for (let i = 0; i < oldHashtags.length; i++) {
            await deleteHashtag(idPost, oldHashtags[i]);
        }

        await updatePostInDb(idPost, postDescription);

        for (let i = 0; i < separatorHashtags.length; i++) {
            const hashtagExists = await getHashtag(separatorHashtags[i]);
            if (hashtagExists.rowCount) {
                await insertHashPost(post.rows[0].id, hashtagExists.rows[0].id);
            }
            else {
                const idHashtag = await insertHashtag(separatorHashtags[i]);
                await insertHashPost(post.rows[0].id, idHashtag.rows[0].id);
            }
        }

        return res.status(200).send("post updated successfully.")
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function getPostsByHashtag(req, res) {
    const { hashtag } = req.params;
    const idUser = res.locals.user;
    try {
        const { rowCount, rows: data } = await getRepositoryPostsByHashtag(hashtag, idUser)
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
