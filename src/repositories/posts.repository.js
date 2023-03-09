import db from '../configs/database.config.js';

export async function insertPost(idUser, postDescription, link){
  
    return await db.query(`INSERT INTO posts (post_link, post_description, user_id) VALUES ($1, $2, $3) RETURNING id;`, [link, postDescription, idUser]);
}

export async function getHashtag(hashtag){
    return await db.query(`SELECT * FROM hashtags WHERE name = $1;`, [hashtag]);
}

export async function insertHashPost(idPost, idHashtag){
    return db.query(`INSERT INTO posts_hashtags (post_id, hashtag_id) VALUES ($1, $2);`, [idPost, idHashtag]);
}

export async function insertHashtag(hashtag){
    return db.query(`INSERT INTO hashtags (name) VALUES ($1) RETURNING id;`, [hashtag]);
}

export async function getLikeFromDb(idUser, idPost) {
    return await db.query(`SELECT * FROM likes WHERE user_id = $1 AND post_id = $2;`, [idUser, idPost]);
}

export async function insertLikePostInDb(idUser, idPost) {
    return await db.query(`INSERT INTO likes (user_id, post_id) VALUES ($1,$2);`, [idUser, idPost]);
}

export async function deleteLikePostInDb(idUser, idPost) {
    return await db.query(`DELETE FROM likes WHERE user_id = $1 AND post_id = $2;`, [idUser, idPost]);
}

export async function getPostsFromDb(idUser) {
    return await db.query(`
    SELECT 
    posts.id as id,
    posts.user_id as post_author_id,
    u2.name AS post_author,
    u2.url AS photo_author,
    posts.post_description,
    posts.post_link,
    (
        SELECT array_agg(name)
        FROM (
            SELECT users.name
            FROM likes
            JOIN users ON likes.user_id = users.id AND likes.user_id != $1
            WHERE likes.post_id = posts.id
            ORDER BY likes.created_at DESC
            LIMIT 2
        ) subquery
    ) AS liked_by,
    COALESCE(bool_or(likes.user_id = $1),false) AS user_liked,
    COUNT(likes.id) AS likes_count
    FROM posts
    LEFT JOIN likes
        ON likes.post_id = posts.id
    LEFT JOIN users
        ON users.id = likes.user_id
    JOIN users u2
        ON u2.id = posts.user_id
    GROUP BY posts.id, u2.id
    ORDER BY posts.created_at DESC
    LIMIT 20;
    `, [idUser])
}

export async function getPostById(idPost) {
    return await db.query(`SELECT * FROM posts WHERE "id" = $1;`, [idPost]);
}

export async function deletePostInDb(idPost) {
    return await db.query(`DELETE FROM posts WHERE "id" = $1;`, [idPost]);
}

export async function updatePostInDb(idPost, postDescription) {
    await db.query(`UPDATE posts SET post_description = $1 WHERE id = $2;`, [postDescription, idPost])
}

export async function getRepositoryPostsByHashtag(hashtag,idUser) {
    return await db.query(`
    SELECT 
        posts.id as id,
        posts.user_id as post_author_id,
        u1.name as post_author,
        u1.url as photo_author,
        posts.post_description,
        posts.post_link,
        (
            SELECT array_agg(name)
            FROM (
                SELECT users.name
                FROM likes
                JOIN users ON likes.user_id = users.id AND likes.user_id != $2
                WHERE likes.post_id = posts.id
                ORDER BY likes.created_at DESC
                LIMIT 2
            ) subquery
        ) AS liked_by,
        COALESCE(bool_or(likes.user_id = $2),false) AS user_liked,
        COUNT(likes.id) as like_count
    FROM posts
    JOIN posts_hashtags
        ON posts.id = posts_hashtags.post_id
    JOIN hashtags
        ON hashtags.id = posts_hashtags.hashtag_id
    LEFT JOIN likes
        ON likes.post_id = posts.id
    JOIN users u1
        ON u1.id = posts.user_id
    LEFT JOIN users u2
        ON likes.user_id = u2.id 
    WHERE hashtags.name = $1
    GROUP BY posts.id, u1.name, u1.url
    ORDER BY posts.created_at DESC
    LIMIT 20
    `,[hashtag,idUser])
}

export async function getPostsByUser(idUser, id){
    return await db.query(`
    SELECT 
        posts.id AS id,
        posts.user_id as post_author_id,
        u1.name AS post_author,
        u1.url AS photo_author,
        posts.post_description,
        posts.post_link,
        (
            SELECT array_agg(name)
            FROM (
                SELECT users.name
                FROM likes
                JOIN users ON likes.user_id = users.id AND likes.user_id != $1
                WHERE likes.post_id = posts.id
                ORDER BY likes.created_at DESC
                LIMIT 2
            ) subquery
        ) AS liked_by,
        COALESCE(bool_or(likes.user_id = $1),false) AS user_liked,
        COUNT(likes.id) AS like_count
    FROM posts
    LEFT JOIN likes
        ON likes.post_id = posts.id
    LEFT JOIN users u1
        ON u1.id = posts.user_id
    LEFT JOIN users u2
        ON likes.user_id = u2.id
    WHERE posts.user_id = $2
    GROUP BY posts.id, u1.name, u1.url
    ORDER BY posts.created_at DESC
    LIMIT 20
    `,[idUser, id])
}