import db from '../configs/database.config.js';

export async function insertPost(data){
    return await db.query(`INSERT INTO posts (id_user, post_description, post_link) VALUES ($1, $2, $3);`, [res.locals.user, data.description, data.link]);
}
export async function getLikeFromDb(idUser, idPost) {
    return await db.query(`SELECT * FROM likes WHERE "userId" = $1 AND "postId" = $2;`, [idUser, idPost]);
}

export async function insertLikePostInDb(idUser, idPost) {
    await db.query(`INSERT INTO likes ("userId", "postId") VALUES ($1,$2);`, [idUser, idPost]);
}

export async function deleteLikePostInDb(idUser, idPost) {
    await db.query(`DELETE FROM likes WHERE "userId" = $1 AND "postId" = $2;`, [idUser, idPost]);
}

export async function getPostFromDb(idPost) {
    return await db.query(`SELECT * FROM posts WHERE "postId" = $1;`, [idPost]);
}

export async function deletePostInDb(idPost) {
    await db.query(`DELETE FROM posts WHERE "postId" = $1;`, [idPost]);
}

export async function updatePostInDb(idPost, newText) {
    await db.query(`UPDATE posts SET text = $1 WHERE "postId" = $2;`, [newText, idPost])
}

export async function getRepositoryPostsByHashtag(hashtag) {
    return await db.query(`
        SELECT 
            users.name,
            users.url as "pictureUrl",
            posts.description,
            posts.url as link,
            COUNT(likes.*) as 'likeCount'
        FROM posts
        JOIN users
        ON users.id = posts."userId"
        JOIN posts_hashtags
        ON posts_hashtags."postId" = posts.id
        JOIN hashtags
        ON posts_hashtags."hashtagId" = hashtags.id
        JOIN likes
        ON likes."idPost" = posts.id
        WHERE hashtags.name = $1
        SORT BY post."createdAt" DESC
        limit 20
    `,[hashtag])
}