import db from '../configs/database.config.js';

export async function insertPost(idUser, data){
   
    return await db.query(`INSERT INTO posts (post_link, post_description, user_id) VALUES ($1, $2, $3);`, [data.link, data.description, idUser]);
}

export async function getLikeFromDb(idUser, idPost) {
    return await db.query(`SELECT * FROM likes WHERE user_id = $1 AND post_id = $2;`, [idUser, idPost]);
}

export async function insertLikePostInDb(idUser, idPost) {
    await db.query(`INSERT INTO likes (user_id, post_id) VALUES ($1,$2);`, [idUser, idPost]);
}

export async function deleteLikePostInDb(idUser, idPost) {
    await db.query(`DELETE FROM likes WHERE user_id = $1 AND post_id = $2;`, [idUser, idPost]);
}

export async function getPostsFromDb(idUser) {
    return await db.query(`
        SELECT posts.*, COUNT(likes.id) AS likes_count, array_agg(users.name) AS liked_by, bool_or(likes.user_id = $1) AS user_liked
        FROM posts
        LEFT JOIN likes
        ON likes.post_id = posts.id
        JOIN users
        ON users.id = likes.user_id
        GROUP BY posts.id
        ORDER BY created_at DESC;
    `,[idUser])
}

export async function getPostById(idPost) {
    return await db.query(`SELECT * FROM posts WHERE "id" = $1;`, [idPost]);
}

export async function deletePostInDb(idPost) {
    await db.query(`DELETE FROM posts WHERE "id" = $1;`, [idPost]);
}

export async function updatePostInDb(idPost, newText) {
    await db.query(`UPDATE posts SET text = $1 WHERE "postId" = $2;`, [newText, idPost])
}

export async function getRepositoryPostsByHashtag(hashtag,idUser) {
    return await db.query(`
    SELECT 
        posts.id as post_id,
        u1.name as user_name,
        u1.url,
        posts.post_description as description,
        posts.post_link as link,
        (array_agg(u2.name))[1:2] AS liked_by,
        bool_or(likes.user_id = $2) AS user_liked,
        COUNT(likes.id) as like_count
    FROM posts
    JOIN posts_hashtags
        ON posts.id = posts_hashtags.post_id
    JOIN hashtags
        ON hashtags.id = posts_hashtags.hashtag_id
    JOIN likes
        ON likes.post_id = posts.id
    JOIN users u1
        ON u1.id = posts.user_id
    JOIN users u2
        ON likes.user_id = u2.id 
    WHERE hashtags.name = $1
    GROUP BY posts.id, u1.name, u1.url
    ORDER BY posts.created_at DESC
    LIMIT 20
    `,[hashtag,idUser])
}
