import db from "../configs/database.config.js";

export async function insertComment(post, user, text) {
    const {rows} = await db.query(`INSERT INTO comments (post_id, user_id, comment_text) VALUES ($1, $2, $3) RETURNING id;`, [post, user, text]);
    return rows[0];
}

export async function getCommentsPost(post){
    const {rows} = await db.query(`
    SELECT comments.comment_text, users.name, users.id AS id_comment_author, users.url AS photo, posts.user_id AS id_post_author 
    FROM comments 
    JOIN users ON comments.user_id = users.id
    JOIN posts ON comments.post_id = posts.id
    WHERE comments.post_id = $1 ORDER BY comments.created_at ASC;`, [post]);
    return rows;
}