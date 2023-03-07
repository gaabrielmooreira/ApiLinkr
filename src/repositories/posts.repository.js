import db from '../configs/database.config.js';

export function getLike(idUser, idPost){
    return db.query(`SELECT * FROM likes WHERE "idUser" = $1 AND "idPost" = $2;`,[idUser,idPost]);
}

export function insertLikeInPost(idUser, idPost){
    db.query(`INSERT INTO likes ("idUser", "idPost") VALUES ($1,$2);`,[idUser,idPost]);
}

export function deleteLikeInPost(idUser, idPost){
    db.query(`DELETE FROM likes WHERE "idUser" = $1 AND "idPost" = $2;`,[idUser,idPost]);
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