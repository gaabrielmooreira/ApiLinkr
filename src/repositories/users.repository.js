import db from "../configs/database.config.js";

export async function selectEmail (email){
    return db.query(`SELECT * FROM users WHERE email = $1;`, [email])
}

export async function insertUser (name, email, password, url){
    db.query(`INSERT INTO users (name, email, password, url) VALUES ($1, $2, $3, $4);`, [name, email, password, url])
    return "ok"
}


export async function searchUserInDB(string,idUser) {
    const { rows: listUsers } = await db.query(`
    SELECT
        USERS.ID,
	    USERS.NAME,
	    USERS.URL AS PHOTO_USER,
	    bool_or(follows.follower_user_id = $2) as IS_FOLLOWING
    FROM USERS
    JOIN follows
        ON follows.followed_user_id = USERS.ID
    WHERE LOWER(NAME) LIKE '%' || LOWER($1) || '%'
    GROUP BY USERS.ID
    ORDER BY IS_FOLLOWING DESC
    `,[string,idUser])
    return listUsers
}