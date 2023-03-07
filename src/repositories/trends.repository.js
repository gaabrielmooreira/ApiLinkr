import db from "../configs/database.config.js";

export default async function getTrendsInDB(){
    return await db.query(`
    SELECT hashtags.name
    FROM hashtags
    RIGHT JOIN posts_hashtags
    	ON hashtags.id = posts_hashtags."hashtagId"
    RIGHT JOIN posts
    	ON posts.id = posts_hashtags."postId"
	WHERE posts."createdAt"::DATE > NOW()::DATE - 1
	GROUP BY hashtags.name
    ORDER BY SUM(posts."visitCount") DESC
    LIMIT 10;
    `)
}
