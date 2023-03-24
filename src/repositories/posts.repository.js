import db from '../configs/database.config.js';

export async function insertPost(idUser, postDescription, post_link, post_link_title, post_link_description, post_link_image) {

    return await db.query(`
    INSERT INTO posts 
    (post_link, post_description, user_id, post_link_title, post_link_description, post_link_image) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING id;
    `, [post_link, postDescription, idUser, post_link_title, post_link_description, post_link_image]);
}

export async function getHashtag(hashtag) {
    return await db.query(`SELECT * FROM hashtags WHERE name = $1;`, [hashtag]);
}

export async function insertHashPost(idPost, idHashtag) {
    return await db.query(`INSERT INTO posts_hashtags (post_id, hashtag_id) VALUES ($1, $2);`, [idPost, idHashtag]);
}

export async function insertHashtag(hashtag) {
    return await db.query(`INSERT INTO hashtags (name) VALUES ($1) RETURNING id;`, [hashtag]);
}

export async function deleteHashtag(idPost, hashtag) {
    return await db.query(`
    DELETE FROM posts_hashtags 
    WHERE id = (SELECT p.id 
        FROM posts_hashtags p 
        JOIN hashtags h 
        ON h.id = p.hashtag_id 
        WHERE post_id = $1 AND h.name = $2
        );`, [idPost, hashtag]);
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

export async function getPostById(idPost) {
    return await db.query(`SELECT * FROM posts WHERE "id" = $1;`, [idPost]);
}

export async function deletePostInDb(idPost) {
    return await db.query(`DELETE FROM posts WHERE "id" = $1;`, [idPost]);
}

export async function updatePostInDb(idPost, postDescription) {
    return await db.query(`UPDATE posts SET post_description = $1 WHERE id = $2;`, [postDescription, idPost])
}

export async function getRepositoryPostsByHashtag(hashtag, idUser) {
    return await db.query(`
    SELECT 
        posts.id as post_id,
        posts.user_id as post_author_id,
        u1.name as post_author,
        u1.url as photo_author,
        posts.post_description,
        posts.post_link,
        posts.post_link_title,
        posts.post_link_description,
        posts.post_link_image,
        (
            SELECT array_agg(name)
            FROM (
                SELECT users.name
                FROM likes
                JOIN users ON likes.user_id = users.id
                WHERE likes.post_id = posts.id AND likes.user_id != $2
                ORDER BY likes.created_at DESC
                LIMIT 2
            ) subquery
        ) AS liked_by,
        COALESCE(bool_or(likes.user_id = $2),false) AS user_liked,
        COUNT(likes.id) as likes_count
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
    `, [hashtag, idUser])
}

export async function getPostsByUser(idUser, id) {
    return await db.query(`
    SELECT 
        posts.id AS post_id,
        posts.user_id as post_author_id,
        u1.name AS post_author,
        u1.url AS photo_author,
        posts.post_description,
        posts.post_link,
        posts.post_link_title,
        posts.post_link_description,
        posts.post_link_image,
        (
            SELECT array_agg(name)
            FROM (
                SELECT users.name
                FROM likes
                JOIN users ON likes.user_id = users.id
                WHERE likes.post_id = posts.id AND likes.user_id != $1
                ORDER BY likes.created_at DESC
                LIMIT 2
            ) subquery
        ) AS liked_by,
        COALESCE(bool_or(likes.user_id = $1),false) AS user_liked,
        COUNT(likes.id) AS likes_count
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
    `, [idUser, id])
}

export async function insertRePost(idPost, idUser) {
    return await db.query(`INSERT INTO re_posts (post_id, user_id) VALUES ($1, $2);`, [idPost, idUser])
}

export async function getRePostCountFromDb(idPost) {
    return await db.query(`SELECT COUNT(post_id) FROM re_posts WHERE post_id = $1;`, [idPost])
}

export async function getRePostsAndPostsAfterDateFromDb(idUser, date) {
    return await db.query(`
    SELECT * FROM (
        SELECT 
            NULL AS re_post_id,
            posts.id AS post_id,
            NULL AS re_posted_by,
            posts.user_id as post_author_id,
            u2.name AS post_author,
            u2.url AS photo_author,
            posts.post_description,
            posts.post_link,
            posts.post_link_title,
            posts.post_link_description,
            posts.post_link_image,
            (
                SELECT array_agg(name)
                FROM (
                    SELECT users.name
                    FROM likes
                    JOIN users ON likes.user_id = users.id
                    WHERE likes.post_id = posts.id AND likes.user_id != $1
                    ORDER BY likes.created_at DESC
                    LIMIT 2
                ) subquery
            ) AS liked_by,
            COALESCE(bool_or(likes.user_id = $1),false) AS user_liked,
            COUNT(likes.id) AS likes_count,
            posts.created_at AS created_at
        FROM posts
        LEFT JOIN likes
            ON likes.post_id = posts.id
        LEFT JOIN users
            ON users.id = likes.user_id
        JOIN users u2
            ON u2.id = posts.user_id
        LEFT JOIN follows 
            ON follows.followed_user_id = posts.user_id
        WHERE posts.created_at > to_timestamp($2) AND posts.user_id != $1 AND follows.follower_user_id = $1
        GROUP BY posts.id, u2.id, follows.follower_user_id
        UNION ALL
        SELECT 
            re_posts.id as re_post_id,
            re_posts.post_id as post_id,
            u3.name as re_posted_by,
            posts.user_id as post_author_id,
            u2.name AS post_author,
            u2.url AS photo_author,
            posts.post_description,
            posts.post_link,
            posts.post_link_title,
            posts.post_link_description,
            posts.post_link_image,
            (
                SELECT array_agg(name)
                FROM (
                    SELECT users.name
                    FROM likes
                    JOIN users ON likes.user_id = users.id
                    WHERE likes.post_id = posts.id AND likes.user_id != $1
                    ORDER BY likes.created_at DESC
                    LIMIT 2
                ) subquery
            ) AS liked_by,
            COALESCE(bool_or(likes.user_id = $1),false) AS user_liked,
            COUNT(likes.id) AS likes_count,
            re_posts.created_at as created_at
        FROM re_posts
        JOIN posts
            ON re_posts.post_id = posts.id
        LEFT JOIN likes
            ON likes.post_id = posts.id
        LEFT JOIN users
            ON users.id = likes.user_id
        JOIN users u2
            ON u2.id = posts.user_id
        JOIN users u3 
            ON u3.id = re_posts.user_id
        LEFT JOIN follows
            ON follows.followed_user_id = re_posts.user_id
        WHERE re_posts.created_at > to_timestamp($2) AND re_posts.user_id != $1 AND follows.follower_user_id = $1
        GROUP BY re_posts.id, posts.id, u2.id,u3.id, follows.follower_user_id
        ) AS combination
    ORDER BY created_at DESC;
    `, [idUser, date])
}

export async function getRePostsAndPostsFromDb(idUser) {
    return await db.query(`
    SELECT * FROM (
        SELECT 
            NULL AS re_post_id,
            posts.id AS post_id,
            NULL AS re_posted_by,
            posts.user_id AS post_author_id,
            u2.name AS post_author,
            u2.url AS photo_author,
            posts.post_description,
            posts.post_link,
            posts.post_link_title,
            posts.post_link_description,
            posts.post_link_image,
            (
                SELECT array_agg(name)
                FROM (
                    SELECT users.name
                    FROM likes
                    JOIN users ON likes.user_id = users.id 
                    WHERE likes.post_id = posts.id AND likes.user_id != $1
                    ORDER BY likes.created_at DESC
                    LIMIT 2
                ) subquery
            ) AS liked_by,
            COALESCE(bool_or(likes.user_id = $1),false) AS user_liked,
            COUNT(likes.id) AS likes_count,
            posts.created_at AS created_at
        FROM posts
        LEFT JOIN likes
            ON likes.post_id = posts.id
        LEFT JOIN users
            ON users.id = likes.user_id
        JOIN users u2
            ON u2.id = posts.user_id
        LEFT JOIN follows 
            ON follows.followed_user_id = posts.user_id
        WHERE follows.follower_user_id = $1 OR posts.user_id = $1
        GROUP BY posts.id, u2.id, follows.follower_user_id
        UNION ALL
        SELECT 
            re_posts.id AS re_post_id,
            re_posts.post_id AS post_id,
            u3.name AS re_posted_by,
            posts.user_id AS post_author_id,
            u2.name AS post_author,
            u2.url AS photo_author,
            posts.post_description,
            posts.post_link,
            posts.post_link_title,
            posts.post_link_description,
            posts.post_link_image,
            (
                SELECT array_agg(name)
                FROM (
                    SELECT users.name
                    FROM likes
                    JOIN users ON likes.user_id = users.id
                    WHERE likes.post_id = posts.id AND likes.user_id != $1
                    ORDER BY likes.created_at DESC
                    LIMIT 2
                ) subquery
            ) AS liked_by,
            COALESCE(bool_or(likes.user_id = $1),false) AS user_liked,
            COUNT(likes.id) AS likes_count,
            re_posts.created_at AS created_at
        FROM re_posts
        JOIN posts
            ON re_posts.post_id = posts.id
        LEFT JOIN likes
            ON likes.post_id = posts.id
        LEFT JOIN users
            ON users.id = likes.user_id
        JOIN users u2
            ON u2.id = posts.user_id
        JOIN users u3 
            ON u3.id = re_posts.user_id
        LEFT JOIN follows 
            ON follows.followed_user_id = re_posts.user_id
        WHERE follows.follower_user_id = $1 OR re_posts.user_id = $1
        GROUP BY re_posts.id, posts.id, u2.id,u3.id, follows.follower_user_id
        ) AS combination
    ORDER BY created_at DESC;
    `, [idUser]);
}