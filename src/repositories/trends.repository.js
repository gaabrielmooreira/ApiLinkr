import db from "../configs/database.config.js";

export default async function getTrendsInDB(){
    return await db.query(`
    SELECT hashtags.name
    FROM hashtags
    LEFT JOIN posts_hashtags
    	ON hashtags.id = posts_hashtags.hashtag_id
    LEFT JOIN posts
    	ON posts.id = posts_hashtags.post_id
	WHERE posts.created_at::DATE > NOW()::DATE - 1
	GROUP BY hashtags.name
    ORDER BY COUNT(posts.*) DESC
    LIMIT 10;
    `)
}
