import db from "../configs/database.config.js";

export async function insertComment(post, user, text) {
    const {rows} = await db.query(`INSERT INTO comments (post_id, user_id, comment_text) VALUES ($1, $2, $3) RETURNING id;`, [post, user, text]);
    return rows[0];
}

export async function getCommentsPost(idPost, idUser){
    const {rows} = await db.query(`
    SELECT comments.comment_text, users.name, users.url AS photo,
	(users.id = posts.user_id) as is_author, 
    COALESCE(follows.follower_user_id = $2,false) as is_following
    FROM comments 
    JOIN users ON comments.user_id = users.id
    JOIN posts ON comments.post_id = posts.id
    LEFT JOIN follows on comments.user_id = follows.followed_user_id and follows.follower_user_id = $2
    WHERE comments.post_id = $1 ORDER BY comments.created_at ASC;    
    `, [idPost, idUser]);
    return rows;
}